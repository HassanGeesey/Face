import React, { useState } from 'react';
import { View, Text, Button, ScrollView, Alert } from 'react-native';
import { quotlyManager, EMPTY_QUOTATION } from '../src/index.js';

export default function QuotationView() {
  const [quotation, setQuotation] = useState({
    ...EMPTY_QUOTATION,
    date: '18/02/2025',
    company: {
      name: 'My Awesome Company',
      email: 'hello@awesome.com',
      address: '123 Tech Lane, Innovation City',
      logo: 'https://via.placeholder.com/150',
    },
    customer: { name: 'Valued Client' },
    lineItems: [
      { description: 'Consulting Services', qty: 10, unitPrice: 150, unit: 'HRS' },
      { description: 'Cloud Setup', qty: 1, unitPrice: 500, unit: 'UNIT' },
    ],
  });

  const handleGeneratePDF = async () => {
    try {
      // Use Mode B to generate PDF
      const blob = await quotlyManager(quotation, 'B');
      Alert.alert('Success', 'PDF generated successfully! Size: ' + blob.size);

      // In a real app, you'd use react-native-fs or similar to save this blob
      // const path = `\${RNFS.DocumentDirectoryPath}/quotation.pdf`;
      // await RNFS.writeFile(path, blobBase64, 'base64');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handlePreview = async () => {
    const result = await quotlyManager(quotation, 'C');
    if (result.isValid) {
      Alert.alert('Valid', `Grand Total: \${result.quotation.grandTotal}`);
    } else {
      Alert.alert('Invalid', result.errors.join('\n'));
    }
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Quotly Preview</Text>
      <View style={{ marginVertical: 20 }}>
        <Text>Company: {quotation.company.name}</Text>
        <Text>Customer: {quotation.customer.name}</Text>
        <Text>Items: {quotation.lineItems.length}</Text>
      </View>

      <Button title="Validate & Preview" onPress={handlePreview} />
      <View style={{ height: 10 }} />
      <Button title="Generate PDF" onPress={handleGeneratePDF} />
    </ScrollView>
  );
}
