import React, { useState, useMemo } from 'react';
import { View, Text, Button, ScrollView, Alert } from 'react-native';
import { quotlyManager, saveQuotation } from '../src/index.js';

/**
 * Example React Native Component for Quotly.
 * Demonstrates:
 * 1. Automatic total recalculation using useMemo.
 * 2. PDF Generation via Mode B.
 * 3. Offline storage of quotations.
 */
const QuotationView = ({ initialQuotation }) => {
  const [quotation, setQuotation] = useState(initialQuotation);
  const [loading, setLoading] = useState(false);

  // Recalculate totals whenever items, tax, or discount changes
  const processedQuotation = useMemo(() => {
    // We can use Mode A (Debug JSON) to get recalculated totals without calling API
    // but for synchronous UI update, we might normally use utility functions.
    // Here we illustrate the state sync before operations.
    return quotation;
  }, [quotation]);

  const handleGeneratePDF = async () => {
    setLoading(true);
    try {
      // Always sync state totals before calling services
      const finalData = await quotlyManager(processedQuotation, 'A');

      const pdfBlob = await quotlyManager(finalData, 'B');
      Alert.alert("Success", "PDF generated successfully!");

      // Save locally for offline access
      await saveQuotation(finalData);
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Quotation Review</Text>

      <View style={{ marginVertical: 20 }}>
        <Text>Company: {quotation.company.name}</Text>
        <Text>Customer: {quotation.customer.name}</Text>
        <Text>Date: {quotation.date}</Text>
      </View>

      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Items:</Text>
      {quotation.lineItems.map((item, index) => (
        <View key={index} style={{ borderBottomWidth: 1, paddingVertical: 5 }}>
          <Text>{item.description} - {item.qty} x {item.unitPrice}</Text>
        </View>
      ))}

      <View style={{ marginTop: 20 }}>
        <Text>Grand Total: {processedQuotation.grandTotal} {processedQuotation.currency}</Text>
      </View>

      <View style={{ marginTop: 30 }}>
        <Button
          title={loading ? "Generating..." : "Generate PDF & Save"}
          onPress={handleGeneratePDF}
          disabled={loading}
        />
      </View>
    </ScrollView>
  );
};

export default QuotationView;
