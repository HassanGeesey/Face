import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  Button,
  ScrollView,
  Alert,
} from 'react-native';
import {
  quotlyManager,
  calculateDetailedTotals,
  updateLineItemsTotals,
  saveQuotation
} from '../src/index.js';

/**
 * Example QuotationView Component
 * Demonstrates:
 * 1. Financial recalculation with useMemo
 * 2. Generating PDF via pdfgen.app
 * 3. Saving quotation data for offline use
 */
const QuotationView = ({ initialQuotation }) => {
  const [quotation, setQuotation] = useState(initialQuotation);
  const [isGenerating, setIsGenerating] = useState(false);

  // Synchronize financial totals whenever line items, taxRate, or discount change.
  // We use useMemo to prevent unnecessary re-calculations and infinite loops if used in useEffects.
  const processedQuotation = useMemo(() => {
    const updatedItems = updateLineItemsTotals(quotation.lineItems || []);
    const detailed = calculateDetailedTotals({ ...quotation, lineItems: updatedItems });

    return {
      ...quotation,
      lineItems: updatedItems,
      subTotal: detailed.subTotal,
      taxAmount: detailed.taxAmount,
      grandTotal: detailed.grandTotal,
    };
  }, [quotation]);

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    try {
      // Call Mode B for PDF generation
      const pdfBlob = await quotlyManager(processedQuotation, 'B');
      Alert.alert("Success", "PDF Generated successfully. Blob size: " + pdfBlob.size);
    } catch (error) {
      Alert.alert("Generation Failed", error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveOffline = async () => {
    try {
      const id = `Q-${Date.now()}`;
      await saveQuotation(id, processedQuotation);
      Alert.alert("Saved", "Quotation saved locally for offline access.");
    } catch (error) {
      Alert.alert("Save Error", error.message);
    }
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Quotation #{processedQuotation.date}</Text>

      <View style={{ marginVertical: 20 }}>
        <Text>Company: {processedQuotation.company.name}</Text>
        <Text>Customer: {processedQuotation.customer.name}</Text>
      </View>

      <View>
        {processedQuotation.lineItems.map((item) => (
          <View key={item.no} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
            <Text>{item.description} (x{item.qty})</Text>
            <Text>{processedQuotation.currency || '$'}{item.total}</Text>
          </View>
        ))}
      </View>

      <View style={{ borderTopWidth: 1, marginTop: 10, paddingTop: 10 }}>
        <Text>Subtotal: {processedQuotation.subTotal}</Text>
        <Text>Tax: {processedQuotation.taxAmount}</Text>
        <Text style={{ fontWeight: 'bold' }}>Grand Total: {processedQuotation.grandTotal}</Text>
      </View>

      <View style={{ marginTop: 30, gap: 10 }}>
        <Button
          title={isGenerating ? "Generating..." : "Generate PDF"}
          onPress={handleGeneratePDF}
          disabled={isGenerating}
        />
        <Button
          title="Save Offline"
          onPress={handleSaveOffline}
          color="#666"
        />
      </View>
    </ScrollView>
  );
};

export default QuotationView;
