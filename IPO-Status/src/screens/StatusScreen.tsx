import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, List } from 'react-native-paper';
import { useAppContext } from '../context/AppContext';
import { IpoItem } from '../api';

export const StatusScreen = () => {
  const { fetchResults, selectedIpos, accounts } = useAppContext();
  
  const validIpos = selectedIpos.filter((ipo): ipo is IpoItem => ipo !== null);

  const getStatusDisplay = (pan: string, symbol: string) => {
    const res = fetchResults.find(r => r.pan === pan && r.symbol === symbol);
    if (!res) return '-';
    
    switch (res.status) {
      case '✔-lots': return `✔-${res.lots}`;
      case '✗': return '✗';
      case '🔄': return '🔄';
      case '⚠️': return '⚠️';
      case 'N/A': return 'N/A';
      default: return '-';
    }
  };

  if (validIpos.length === 0) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.emptyText}>No IPOs selected for fetching.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {validIpos.map((ipo, index) => (
        <View key={ipo.symbol} style={styles.ipoSection}>
          <View style={styles.header}>
            <Text style={styles.title}>{ipo.name}</Text>
          </View>
          
          <View style={styles.listHeader}>
            <Text style={styles.headerText}>Name</Text>
            <Text style={styles.headerText}>Status</Text>
          </View>

          {accounts.map(acc => (
            <List.Item
              key={`${ipo.symbol}-${acc.pan}`}
              title={acc.name}
              right={() => <Text style={styles.statusText}>{getStatusDisplay(acc.pan, ipo.symbol)}</Text>}
              style={styles.listItem}
            />
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: 'gray',
  },
  ipoSection: {
    marginBottom: 20,
  },
  header: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fafafa',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerText: {
    fontWeight: 'bold',
  },
  listItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  statusText: {
    fontSize: 18,
    alignSelf: 'center',
    marginRight: 10,
  }
});
