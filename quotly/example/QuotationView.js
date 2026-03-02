import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  Alert,
  StyleSheet
} from 'react-native';
import {
  updateLineItemsTotals,
  calculateDetailedTotals,
  quotlyManager,
  saveQuotation
} from '../src/index.js'; // Use relative import for internal example

/**
 * Example React Native component demonstrating library usage.
 * It uses useMemo for safe totals calculations to prevent infinite loops during renders.
 */
const QuotationView = ({ initialQuotation }) => {
  const [quotation, setQuotation] = useState(initialQuotation);
  const [loading, setLoading] = useState(false);

  // Safely calculate totals whenever line items, tax, or discount change.
  // This memoized object contains everything needed for the services.
  const processedData = useMemo(() => {
    const updatedItems = updateLineItemsTotals(quotation.lineItems || []);
    const detailed = calculateDetailedTotals({ ...quotation, lineItems: updatedItems });
    return {
      ...quotation,
      lineItems: updatedItems,
      ...detailed
    };
  }, [quotation.lineItems, quotation.taxRate, quotation.discount]);

  const handleGeneratePDF = async () => {
    setLoading(true);
    try {
      // Use the processedData which contains updated totals and line items
      const pdfBlob = await quotlyManager(processedData, 'B');
      // Logic for saving or sharing the PDF blob in React Native
      Alert.alert("Success", "PDF generated successfully!");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveOffline = async () => {
    try {
      const id = Date.now().toString();
      // Ensure we save the quotation with updated totals
      await saveQuotation(id, processedData);
      Alert.alert("Saved", "Quotation saved for offline use.");
    } catch (error) {
      Alert.alert("Error", "Failed to save quotation.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quotation Review</Text>

      <View style={styles.row}>
        <Text>Subtotal:</Text>
        <Text>{processedData.currency} {processedData.subTotal}</Text>
      </View>

      <View style={styles.row}>
        <Text>Tax ({processedData.taxRate}%):</Text>
        <Text>{processedData.currency} {processedData.taxAmount}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.grandTotalText}>Grand Total:</Text>
        <Text style={styles.grandTotalText}>{processedData.currency} {processedData.grandTotal}</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          <Button title="Generate PDF" onPress={handleGeneratePDF} />
          <Button title="Save Offline" onPress={handleSaveOffline} color="#666" />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  grandTotalText: { fontWeight: 'bold', fontSize: 18, color: 'green' }
});

export default QuotationView;
