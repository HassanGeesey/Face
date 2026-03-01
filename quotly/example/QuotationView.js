import React, { useMemo, useState } from 'react';
import { View, Text, Button, ScrollView, StyleSheet, Alert } from 'react-native';
import { updateLineItemsTotals, calculateDetailedTotals, quotlyManager } from '../src/index.js';

/**
 * Example React Native component demonstrating Quotly library usage.
 */
export default function QuotationView() {
  const [quotation, setQuotation] = useState({
    date: "25/12/2023",
    company: {
      logo: "https://example.com/logo.png",
      name: "My Awesome Company",
      email: "hello@awesome.com",
      address: "456 Innovation Ave",
      mobiles: ["+1 555-0199"],
      landline: "+1 555-0100",
    },
    customer: {
      name: "Happy Client",
    },
    lineItems: [
      { qty: 1, unitPrice: 150.00, description: "Consultation Fee" },
      { qty: 2, unitPrice: 45.00, description: "Detailed Report" }
    ],
    taxRate: 5,
    discount: 10,
    currency: "USD",
  });

  // Safe totals calculation using useMemo to prevent infinite loops
  const financialSummary = useMemo(() => {
    const updatedItems = updateLineItemsTotals(quotation.lineItems);
    return calculateDetailedTotals({ ...quotation, lineItems: updatedItems });
  }, [quotation]);

  const handleGeneratePDF = async () => {
    try {
      // Use Mode B to generate PDF
      const pdfBlob = await quotlyManager(quotation, 'B');
      Alert.alert("Success", "PDF generated successfully!");
      // Logic to save/share the blob using react-native-fs or similar
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Quotation Summary</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Company: {quotation.company.name}</Text>
        <Text style={styles.label}>Customer: {quotation.customer.name}</Text>
      </View>

      <View style={styles.section}>
        {quotation.lineItems.map((item, idx) => (
          <Text key={idx} style={styles.item}>
            • {item.description} (x{item.qty}) - {quotation.currency} {(item.qty * item.unitPrice).toFixed(2)}
          </Text>
        ))}
      </View>

      <View style={styles.summary}>
        <Text>Subtotal: {quotation.currency} {financialSummary.subTotal}</Text>
        <Text>Discount: - {quotation.currency} {quotation.discount.toFixed(2)}</Text>
        <Text>Tax ({quotation.taxRate}%): {quotation.currency} {financialSummary.taxAmount}</Text>
        <Text style={styles.total}>Grand Total: {quotation.currency} {financialSummary.grandTotal}</Text>
      </View>

      <Button title="Generate PDF" onPress={handleGeneratePDF} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  section: { marginBottom: 15 },
  label: { fontSize: 16 },
  item: { fontSize: 14, color: '#555' },
  summary: { marginTop: 20, borderTopWidth: 1, paddingTop: 10, marginBottom: 30 },
  total: { fontSize: 18, fontWeight: 'bold', marginTop: 5 },
});
