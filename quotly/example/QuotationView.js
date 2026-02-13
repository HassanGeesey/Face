import React, { useState } from "react";
import { View, Text, Button, ScrollView } from "react-native";
import {
  EMPTY_QUOTATION,
  updateLineItemsTotals,
  calculateGrandTotal,
  quotlyManager,
} from "../src/index";

const QuotationView = () => {
  const [quotation, setQuotation] = useState({
    ...EMPTY_QUOTATION,
    date: "25/12/2024",
    company: {
      name: "Quotly Corp",
      email: "hello@quotly.app",
      address: "123 Tech Lane",
      logo: "https://example.com/logo.png",
      mobiles: ["+123456789"],
    },
    customer: {
      name: "John Doe",
    },
    lineItems: [{ qty: 2, unitPrice: 50, description: "Consulting", unit: "HRS" }],
  });

  const handleGeneratePDF = async () => {
    try {
      // 1. Update totals
      const updatedItems = updateLineItemsTotals(quotation.lineItems);
      const grandTotal = calculateGrandTotal(updatedItems);
      const finalQuotation = {
        ...quotation,
        lineItems: updatedItems,
        grandTotal,
      };

      // 2. Generate PDF (Mode B)
      const pdfBlob = await quotlyManager(finalQuotation, "B");
      console.log("PDF Generated successfully", pdfBlob);
      alert("PDF Generated successfully");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>
        Quotation for {quotation.customer.name}
      </Text>
      <Text>Company: {quotation.company.name}</Text>
      <Text>Date: {quotation.date}</Text>

      <View style={{ marginVertical: 20 }}>
        {quotation.lineItems.map((item, index) => (
          <Text key={index}>
            {item.description} - {item.qty} x {item.unitPrice}
          </Text>
        ))}
      </View>

      <Button title="Generate PDF" onPress={handleGeneratePDF} />
    </ScrollView>
  );
};

export default QuotationView;
