import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, TextInput, Button, Dialog, Portal, FAB, IconButton, List, Provider as PaperProvider } from 'react-native-paper';
import { useAppContext } from '../context/AppContext';
import { Account, addAccount, editAccount, deleteAccount } from '../db';

export const AccountsScreen = () => {
  const { accounts, refreshAccounts } = useAppContext();
  const [visible, setVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [selectedAcc, setSelectedAcc] = useState<Account | null>(null);
  const [name, setName] = useState('');
  const [pan, setPan] = useState('');
  
  const hideDialog = () => {
    setVisible(false);
    setSelectedAcc(null);
    setName('');
    setPan('');
  };

  const showAdd = () => {
    setVisible(true);
  };

  const showEdit = (acc: Account) => {
    setSelectedAcc(acc);
    setName(acc.name);
    setPan(acc.pan);
    setVisible(true);
  };

  const showDelete = (acc: Account) => {
    setSelectedAcc(acc);
    setDeleteVisible(true);
  };

  const handleSave = async () => {
    if (!name || !pan) return;
    if (selectedAcc) {
      await editAccount(selectedAcc.id, name, pan);
    } else {
      await addAccount(name, pan.toUpperCase());
    }
    await refreshAccounts();
    hideDialog();
  };

  const handleDelete = async () => {
    if (selectedAcc) {
      await deleteAccount(selectedAcc.id);
      await refreshAccounts();
    }
    setDeleteVisible(false);
    setSelectedAcc(null);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={accounts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <List.Item
            title={item.name}
            description={item.pan}
            right={props => (
              <View style={styles.row}>
                <IconButton {...props} icon="pencil" onPress={() => showEdit(item)} />
                <IconButton {...props} icon="delete" onPress={() => showDelete(item)} />
              </View>
            )}
          />
        )}
      />

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={showAdd}
      />

      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>{selectedAcc ? 'Edit Account' : 'Add Account'}</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Name"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            <TextInput
              label="PAN Card"
              value={pan}
              onChangeText={setPan}
              autoCapitalize="characters"
              style={styles.input}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Cancel</Button>
            <Button onPress={handleSave}>Save</Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog visible={deleteVisible} onDismiss={() => setDeleteVisible(false)}>
          <Dialog.Title>Confirm Delete</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to delete {selectedAcc?.name}?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteVisible(false)}>Cancel</Button>
            <Button onPress={handleDelete}>Delete</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  input: {
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
  }
});
