import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Text, Button, Menu, ActivityIndicator, FAB } from 'react-native-paper';
import { useAppContext } from '../context/AppContext';
import { useNavigation } from '@react-navigation/native';
import { IpoItem } from '../api';

const IpoDropdown = ({
  index,
  selectedIpo,
  allIpos,
  selectedIpos,
  onSelect
}: {
  index: number;
  selectedIpo: IpoItem | null;
  allIpos: IpoItem[];
  selectedIpos: (IpoItem | null)[];
  onSelect: (ipo: IpoItem) => void;
}) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const availableIpos = allIpos.filter(
    ipo => !selectedIpos.some((selected, i) => i !== index && selected?.symbol === ipo.symbol)
  );

  return (
    <View style={styles.dropdownContainer}>
      <Text style={styles.label}>Select IPO {index + 1}:</Text>
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.dropdownAnchor}>
            <Text>{selectedIpo ? selectedIpo.name : 'Select an IPO'}</Text>
          </TouchableOpacity>
        }
      >
        {availableIpos.map((ipo, idx) => (
          <Menu.Item 
            key={`${ipo.symbol}-${idx}`} 
            onPress={() => {
              onSelect(ipo);
              setMenuVisible(false);
            }} 
            title={ipo.name} 
          />
        ))}
      </Menu>
    </View>
  );
};

export const FetchScreen = () => {
  const { ipos, selectedIpos, setSelectedIpos, performFetch, isFetching, dbInitialized } = useAppContext();
  const navigation = useNavigation();

  if (!dbInitialized) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const handleFetch = async () => {
    const hasSelection = selectedIpos.some(ipo => ipo !== null);
    if (!hasSelection) return;
    await performFetch();
    // @ts-ignore
    navigation.navigate('Status');
  };

  const updateSelection = (index: number, ipo: IpoItem) => {
    const newSelected = [...selectedIpos];
    newSelected[index] = ipo;
    setSelectedIpos(newSelected);
  };

  const addDropdown = () => {
    if (selectedIpos.length < 5) {
      setSelectedIpos([...selectedIpos, null]);
    }
  };

  const isSelected = selectedIpos.some(ipo => ipo !== null);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {selectedIpos.map((selectedIpo, index) => (
          <IpoDropdown
            key={`dropdown-${index}`}
            index={index}
            selectedIpo={selectedIpo}
            allIpos={ipos}
            selectedIpos={selectedIpos}
            onSelect={(ipo) => updateSelection(index, ipo)}
          />
        ))}
        
        {selectedIpos.length < 5 && (
          <View style={styles.fabContainer}>
            <FAB
              icon="plus"
              style={styles.fab}
              onPress={addDropdown}
              size="small"
            />
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          mode="contained"
          buttonColor={isSelected ? '#2196F3' : '#E0E0E0'}
          textColor={isSelected ? '#FFFFFF' : '#757575'}
          onPress={handleFetch}
          loading={isFetching}
          disabled={!isSelected || isFetching}
          style={styles.fetchBtn}
        >
          Fetch Status
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
    flexGrow: 1,
  },
  dropdownContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  dropdownAnchor: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    borderRadius: 8,
  },
  fabContainer: {
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  fab: {
    backgroundColor: '#e0e0e0',
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
  },
  fetchBtn: {
    paddingVertical: 8,
  }
});
