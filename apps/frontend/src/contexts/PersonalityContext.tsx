import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { getMetaPrompts } from '../api/index.ts';

interface Personality {
  id: number;
  name: string;
  promptText: string;
  isDefault: boolean;
}

interface PersonalityContextType {
  personalities: Personality[];
  selectedPersonalityId: number | undefined;
  setSelectedPersonalityId: (id: number) => void;
  isLoading: boolean;
  error: string | undefined;
}

const PersonalityContext = createContext<PersonalityContextType | undefined>(
  undefined
);

export function PersonalityProvider({ children }: { children: ReactNode }) {
  const [personalities, setPersonalities] = useState<Personality[]>([]);
  const [selectedPersonalityId, setSelectedPersonalityId] = useState<
    number | undefined
  >();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    async function fetchPersonalities() {
      try {
        const data = await getMetaPrompts();
        const personalityList = data.metaPrompts || [];
        setPersonalities(personalityList);

        // Set default personality
        const defaultPersonality = personalityList.find(
          (p: Personality) => p.isDefault
        );
        if (defaultPersonality) {
          setSelectedPersonalityId(defaultPersonality.id);
        } else if (personalityList.length > 0) {
          setSelectedPersonalityId(personalityList[0].id);
        }
      } catch (error_) {
        console.error('Failed to load personalities:', error_);
        setError('Failed to load personalities');
      } finally {
        setIsLoading(false);
      }
    }

    fetchPersonalities();
  }, []);

  return (
    <PersonalityContext.Provider
      value={{
        personalities,
        selectedPersonalityId,
        setSelectedPersonalityId,
        isLoading,
        error,
      }}
    >
      {children}
    </PersonalityContext.Provider>
  );
}

export function usePersonality() {
  const context = useContext(PersonalityContext);
  if (context === undefined) {
    throw new Error('usePersonality must be used within a PersonalityProvider');
  }
  return context;
}
