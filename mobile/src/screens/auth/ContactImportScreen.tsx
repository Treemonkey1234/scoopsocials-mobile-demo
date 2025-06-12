import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { useDispatch } from 'react-redux';
import { setContacts } from '../../store/userSlice';
import { loginSuccess } from '../../store/authSlice';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

type ContactImportScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'ContactImport'>;

interface Props {
  navigation: ContactImportScreenNavigationProp;
}

interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
  hasApp: boolean;
}

export default function ContactImportScreen({ navigation }: Props) {
  const dispatch = useDispatch();
  const [contacts, setContactsState] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  const mockContacts: Contact[] = [
    { id: '1', name: 'Sarah Chen', phoneNumber: '+1234567890', hasApp: true },
    { id: '2', name: 'Mike Johnson', phoneNumber: '+1234567891', hasApp: true },
    { id: '3', name: 'Emma Davis', phoneNumber: '+1234567892', hasApp: false },
    { id: '4', name: 'Alex Rodriguez', phoneNumber: '+1234567893', hasApp: true },
    { id: '5', name: 'Jessica Wong', phoneNumber: '+1234567894', hasApp: false },
    { id: '6', name: 'David Kim', phoneNumber: '+1234567895', hasApp: true },
  ];

  const requestContactsPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          {
            title: 'Contacts Permission',
            message: 'ScoopSocials needs access to your contacts to help you find friends who are already on the app.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true; // iOS handles permission differently
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const handleImportContacts = async () => {
    setIsLoading(true);
    
    const permission = await requestContactsPermission();
    if (!permission) {
      Alert.alert(
        'Permission Required',
        'We need access to your contacts to help you find friends on ScoopSocials.'
      );
      setIsLoading(false);
      return;
    }

    setHasPermission(true);
    
    // Mock import - replace with actual contact reading
    setTimeout(() => {
      setContactsState(mockContacts);
      dispatch(setContacts(mockContacts));
      setIsLoading(false);
    }, 2000);
  };

  const handleSkip = () => {
    completeSetup();
  };

  const handleContinue = () => {
    completeSetup();
  };

  const completeSetup = () => {
    // Complete account creation and log user in
    dispatch(loginSuccess({
      token: 'mock-jwt-token',
      refreshToken: 'mock-refresh-token'
    }));
  };

  const ContactItem = ({ contact }: { contact: Contact }) => (
    <View style={styles.contactItem}>
      <View style={styles.contactInfo}>
        <View style={styles.contactAvatar}>
          <Text style={styles.contactInitial}>
            {contact.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.contactDetails}>
          <Text style={styles.contactName}>{contact.name}</Text>
          <Text style={styles.contactPhone}>{contact.phoneNumber}</Text>
        </View>
      </View>
      <View style={styles.contactStatus}>
        {contact.hasApp ? (
          <View style={styles.hasAppContainer}>
            <Icon name="check-circle" size={20} color="#4CAF50" />
            <Text style={styles.hasAppText}>On ScoopSocials</Text>
          </View>
        ) : (
          <TouchableOpacity style={styles.inviteButton}>
            <Text style={styles.inviteButtonText}>Invite</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#00BCD4', '#2196F3']}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Find Friends</Text>
        <Text style={styles.subtitle}>
          Discover who's already on ScoopSocials and invite others to join
        </Text>
      </LinearGradient>

      <View style={styles.content}>
        {!hasPermission ? (
          <View style={styles.permissionContainer}>
            <Icon name="contacts" size={80} color="#00BCD4" />
            <Text style={styles.permissionTitle}>Connect with Friends</Text>
            <Text style={styles.permissionDescription}>
              We'll check your contacts to see who's already on ScoopSocials and help you connect with them instantly.
            </Text>
            
            <View style={styles.benefitsContainer}>
              <View style={styles.benefit}>
                <Icon name="group-add" size={24} color="#4CAF50" />
                <Text style={styles.benefitText}>Find existing friends</Text>
              </View>
              <View style={styles.benefit}>
                <Icon name="send" size={24} color="#4CAF50" />
                <Text style={styles.benefitText}>Invite new friends</Text>
              </View>
              <View style={styles.benefit}>
                <Icon name="security" size={24} color="#4CAF50" />
                <Text style={styles.benefitText}>Your privacy is protected</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.importButton, isLoading && styles.disabledButton]}
              onPress={handleImportContacts}
              disabled={isLoading}
            >
              <Icon name="contacts" size={20} color="#fff" />
              <Text style={styles.importButtonText}>
                {isLoading ? 'Importing Contacts...' : 'Import Contacts'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.contactsContainer}>
            <Text style={styles.contactsHeader}>
              Found {contacts.filter(c => c.hasApp).length} friends on ScoopSocials
            </Text>
            
            <FlatList
              data={contacts}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <ContactItem contact={item} />}
              showsVerticalScrollIndicator={false}
              style={styles.contactsList}
            />
          </View>
        )}
      </View>

      <View style={styles.footer}>
        {hasPermission ? (
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
          >
            <Text style={styles.continueButtonText}>Continue to App</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleSkip}
          >
            <Text style={styles.skipButtonText}>Skip for Now</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 30,
    paddingBottom: 30,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#E3F2FD',
    lineHeight: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 16,
  },
  permissionDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  benefitsContainer: {
    marginBottom: 40,
  },
  benefit: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  benefitText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  importButton: {
    flexDirection: 'row',
    backgroundColor: '#00BCD4',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  importButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  contactsContainer: {
    flex: 1,
    paddingTop: 20,
  },
  contactsHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  contactsList: {
    flex: 1,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  contactAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#00BCD4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contactInitial: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  contactDetails: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  contactPhone: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  contactStatus: {
    alignItems: 'flex-end',
  },
  hasAppContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hasAppText: {
    fontSize: 12,
    color: '#4CAF50',
    marginLeft: 4,
    fontWeight: '500',
  },
  inviteButton: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  inviteButtonText: {
    fontSize: 14,
    color: '#00BCD4',
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 30,
    paddingBottom: 30,
    paddingTop: 20,
  },
  continueButton: {
    backgroundColor: '#00BCD4',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  skipButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
});