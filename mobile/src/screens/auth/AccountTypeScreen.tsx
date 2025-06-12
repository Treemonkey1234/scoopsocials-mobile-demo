import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

type AccountTypeScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'AccountType'>;

interface Props {
  navigation: AccountTypeScreenNavigationProp;
}

const { width } = Dimensions.get('window');

export default function AccountTypeScreen({ navigation }: Props) {
  const [selectedType, setSelectedType] = useState<'free' | 'professional' | null>(null);

  const handleContinue = () => {
    if (selectedType) {
      navigation.navigate('ContactImport');
    }
  };

  const AccountTypeCard = ({ 
    type, 
    title, 
    subtitle, 
    features, 
    price, 
    popular = false 
  }: {
    type: 'free' | 'professional';
    title: string;
    subtitle: string;
    features: string[];
    price: string;
    popular?: boolean;
  }) => {
    const isSelected = selectedType === type;
    
    return (
      <TouchableOpacity
        style={[styles.card, isSelected && styles.selectedCard]}
        onPress={() => setSelectedType(type)}
      >
        {popular && (
          <View style={styles.popularBadge}>
            <Text style={styles.popularText}>POPULAR</Text>
          </View>
        )}
        
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, isSelected && styles.selectedText]}>{title}</Text>
          <Text style={[styles.cardSubtitle, isSelected && styles.selectedSubtext]}>{subtitle}</Text>
          <Text style={[styles.price, isSelected && styles.selectedText]}>{price}</Text>
        </View>

        <View style={styles.featuresContainer}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <Icon 
                name="check-circle" 
                size={20} 
                color={isSelected ? '#00BCD4' : '#4CAF50'} 
              />
              <Text style={[styles.featureText, isSelected && styles.selectedFeatureText]}>
                {feature}
              </Text>
            </View>
          ))}
        </View>

        {isSelected && (
          <View style={styles.selectedIndicator}>
            <Icon name="radio-button-checked" size={24} color="#00BCD4" />
          </View>
        )}
        
        {!isSelected && (
          <View style={styles.unselectedIndicator}>
            <Icon name="radio-button-unchecked" size={24} color="#ccc" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

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
        <Text style={styles.title}>Choose Your Plan</Text>
        <Text style={styles.subtitle}>
          Select the account type that best fits your needs
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <AccountTypeCard
          type="free"
          title="Free Account"
          subtitle="Perfect for getting started"
          price="$0/month"
          features={[
            "Basic posting and reviewing",
            "Standard friend connections",
            "Event attendance",
            "Trust score display",
            "Community validation"
          ]}
        />

        <AccountTypeCard
          type="professional"
          title="Professional Account"
          subtitle="For power users and organizers"
          price="$9.99/month"
          popular={true}
          features={[
            "Everything in Free",
            "Create Local Community Hubs",
            "Create Interest-Based Groups",
            "Enhanced event management",
            "Advanced community features",
            "Priority support",
            "Analytics dashboard"
          ]}
        />

        <View style={styles.comparisonNote}>
          <Icon name="info" size={20} color="#666" />
          <Text style={styles.comparisonText}>
            You can upgrade or downgrade your plan anytime in settings
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.continueButton, !selectedType && styles.disabledButton]}
          onPress={handleContinue}
          disabled={!selectedType}
        >
          <Text style={styles.continueButtonText}>
            Continue with {selectedType === 'free' ? 'Free' : 'Professional'} Account
          </Text>
        </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: 'relative',
  },
  selectedCard: {
    borderColor: '#00BCD4',
    backgroundColor: '#F0FDFF',
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: 20,
    backgroundColor: '#FF6B35',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardHeader: {
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  selectedText: {
    color: '#00BCD4',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  selectedSubtext: {
    color: '#00ACC1',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  selectedFeatureText: {
    color: '#00695C',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  unselectedIndicator: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  comparisonNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 12,
    marginVertical: 20,
  },
  comparisonText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 20,
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  continueButton: {
    backgroundColor: '#00BCD4',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});