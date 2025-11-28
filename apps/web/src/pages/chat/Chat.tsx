import {
  Checkbox,
  DefaultButton,
  Dropdown,
  Panel,
  SpinButton,
  TextField,
  Toggle,
  TooltipHost,
} from '@fluentui/react';
import type { IDropdownOption } from '@fluentui/react/lib-commonjs/Dropdown';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  RetrievalMode,
  apiBaseUrl,
  getChatMessages,
  type RequestOverrides,
} from '../../services/index.js';
import type { Citation } from '../../services/models.js';
import { SettingsButton } from '../../components/SettingsButton/index.js';
import type { CustomStylesState } from '../../components/SettingsStyles/SettingsStyles.js';
import { SettingsStyles } from '../../components/SettingsStyles/SettingsStyles.js';
import { ThemeSwitch } from '../../components/ThemeSwitch/ThemeSwitch.js';
import { CitationsList } from '../../components/chat/CitationsList.js';
import { PersonalityIndicator } from '../../components/chat/PersonalityIndicator.js';
import { RAGVisualizer } from '../../components/chat/RAGVisualizer.js';
import { useAuth } from '../../contexts/AuthContext.js';
import { usePersonality } from '../../contexts/PersonalityContext.js';
import { toolTipText, toolTipTextCalloutProps } from '../../i18n/tooltips.js';
import styles from './Chat.module.css';

// Starter prompts for coaching
const STARTER_PROMPTS = [
  'Help me set and achieve a goal',
  'Improve my communication skills',
  'Navigate a difficult conversation',
  'Build better daily habits',
];

const Chat = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isConfigPanelOpen, setIsConfigPanelOpen] = useState(false);
  const chatComponentReference = useRef<any>(null);
  const [currentChatId, setCurrentChatId] = useState<number | undefined>();
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isRagActive, setIsRagActive] = useState(false);
  const [lastCitations, setLastCitations] = useState<Citation[]>([]);
  const [ragSourcesCount, setRagSourcesCount] = useState(0);
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const {
    personalities,
    selectedPersonalityId,
    setSelectedPersonalityId,
    isLoading: personalitiesLoading,
  } = usePersonality();

  // Load chatId from URL params
  useEffect(() => {
    const chatIdParam = searchParams.get('chatId');
    if (chatIdParam) {
      const chatId = Number.parseInt(chatIdParam, 10);
      if (!Number.isNaN(chatId) && chatId !== currentChatId) {
        setCurrentChatId(chatId);
        loadChatHistory(chatId);
      }
    } else {
      // No chatId = new chat
      setCurrentChatId(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Listen for chat creation events to update URL
  useEffect(() => {
    const handleChatCreated = (event: CustomEvent) => {
      const { chatId } = event.detail;
      if (chatId && !currentChatId) {
        setCurrentChatId(chatId);
        setSearchParams({ chatId: chatId.toString() });
      }
    };
    window.addEventListener('chat-created', handleChatCreated as EventListener);
    return () => {
      window.removeEventListener(
        'chat-created',
        handleChatCreated as EventListener
      );
    };
  }, [currentChatId, setSearchParams]);

  // Listen for chat message events to show RAG visualization and citations
  useEffect(() => {
    const handleMessageStart = () => {
      setIsRagActive(true);
      setRagSourcesCount(0);
    };

    const handleMessageUpdate = (event: CustomEvent) => {
      const { citations } = event.detail || {};
      if (citations && Array.isArray(citations) && citations.length > 0) {
        setRagSourcesCount(citations.length);
        setLastCitations(citations);
      }
    };

    const handleMessageComplete = (event: CustomEvent) => {
      setIsRagActive(false);
      const { citations } = event.detail || {};
      if (citations && Array.isArray(citations)) {
        setLastCitations(citations);
      }
    };

    window.addEventListener(
      'chat-message-start',
      handleMessageStart as EventListener
    );
    window.addEventListener(
      'chat-message-update',
      handleMessageUpdate as EventListener
    );
    window.addEventListener(
      'chat-message-complete',
      handleMessageComplete as EventListener
    );

    return () => {
      window.removeEventListener(
        'chat-message-start',
        handleMessageStart as EventListener
      );
      window.removeEventListener(
        'chat-message-update',
        handleMessageUpdate as EventListener
      );
      window.removeEventListener(
        'chat-message-complete',
        handleMessageComplete as EventListener
      );
    };
  }, []);

  // Load chat history when chatId changes
  const loadChatHistory = async (chatId: number) => {
    setIsLoadingHistory(true);
    try {
      const data = await getChatMessages(chatId);
      const messages = data.messages || [];

      // Load messages into chat-component
      // Use a small delay to ensure the component is mounted
      setTimeout(() => {
        const chatComponent = chatComponentReference.current;
        if (chatComponent && typeof chatComponent.loadMessages === 'function') {
          // Convert database messages to chat-component format
          const formattedMessages = messages.map((msg: any) => ({
            role: msg.role,
            content: msg.content,
            citations: Array.isArray(msg.citations)
              ? msg.citations
              : msg.citations
                ? JSON.parse(msg.citations)
                : [],
          }));
          chatComponent.loadMessages(formattedMessages);

          // Show citations from the last assistant message if available
          const lastAssistantMessage = formattedMessages
            .filter((m: any) => m.role === 'assistant')
            .pop();
          if (lastAssistantMessage?.citations?.length > 0) {
            setLastCitations(lastAssistantMessage.citations);
          }
        }
      }, 100);
    } catch (error) {
      console.error('Failed to load chat history:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleStarterPromptClick = (prompt: string) => {
    // Send the starter prompt to the chat component using the ref
    const chatComponent = chatComponentReference.current;
    if (chatComponent && typeof chatComponent.sendMessage === 'function') {
      chatComponent.sendMessage(prompt);
    }
  };
  const [promptTemplate, setPromptTemplate] = useState<string>('');
  const [retrieveCount, setRetrieveCount] = useState<number>(3);
  const [retrievalMode, setRetrievalMode] = useState<RetrievalMode>(
    RetrievalMode.Hybrid
  );
  const [useSemanticRanker, setUseSemanticRanker] = useState<boolean>(true);
  const [useStream, setUseStream] = useState<boolean>(true);
  const [useSemanticCaptions, setUseSemanticCaptions] =
    useState<boolean>(false);
  const [excludeCategory, setExcludeCategory] = useState<string>('');
  const [useSuggestFollowupQuestions, setUseSuggestFollowupQuestions] =
    useState<boolean>(true);

  const chatMessageStreamEnd = useRef<HTMLDivElement | null>(null);

  const [isBrandingEnabled, setEnableBranding] = useState(() => {
    const storedBranding = localStorage.getItem('ms-azoaicc:isBrandingEnabled');
    return storedBranding ? JSON.parse(storedBranding) : false;
  });

  const onPromptTemplateChange = (
    _event?: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string
  ) => {
    setPromptTemplate(newValue || '');
  };

  const onRetrieveCountChange = (
    _event?: React.SyntheticEvent<HTMLElement, Event>,
    newValue?: string
  ) => {
    setRetrieveCount(Number.parseInt(newValue || '3'));
  };

  const onRetrievalModeChange = (
    _event: React.FormEvent<HTMLDivElement>,
    option?: IDropdownOption<RetrievalMode> | undefined,
    _index?: number | undefined
  ) => {
    setRetrievalMode(option?.data || RetrievalMode.Hybrid);
  };

  const onUseSemanticRankerChange = (
    _event?: React.FormEvent<HTMLElement | HTMLInputElement>,
    checked?: boolean
  ) => {
    setUseSemanticRanker(!!checked);
  };

  const onUseSemanticCaptionsChange = (
    _event?: React.FormEvent<HTMLElement | HTMLInputElement>,
    checked?: boolean
  ) => {
    setUseSemanticCaptions(!!checked);
  };

  const onUseStreamChange = (
    _event?: React.FormEvent<HTMLElement | HTMLInputElement>,
    checked?: boolean
  ) => {
    setUseStream(!!checked);
  };

  const onExcludeCategoryChanged = (
    _event?: React.FormEvent,
    newValue?: string
  ) => {
    setExcludeCategory(newValue || '');
  };

  const onEnableBrandingChange = (
    _event?: React.FormEvent<HTMLElement | HTMLInputElement>,
    checked?: boolean
  ) => {
    setEnableBranding(!!checked);
  };

  const onUseSuggestFollowupQuestionsChange = (
    _event?: React.FormEvent<HTMLElement | HTMLInputElement>,
    checked?: boolean
  ) => {
    setUseSuggestFollowupQuestions(!!checked);
  };

  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    const storedTheme = localStorage.getItem('ms-azoaicc:isDarkTheme');
    return storedTheme ? JSON.parse(storedTheme) : false;
  });

  const [customStyles, setCustomStyles] = useState(() => {
    const styleDefaultsLight = {
      AccentHigh: '#692b61',
      AccentLight: '#f6d5f2',
      AccentDark: '#5e3c7d',
      TextColor: '#123f58',
      BackgroundColor: '#e3e3e3',
      ForegroundColor: '#4e5288',
      FormBackgroundColor: '#f5f5f5',
      BorderRadius: '10px',
      BorderWidth: '3px',
      FontBaseSize: '14px',
    };

    const styleDefaultsDark = {
      AccentHigh: '#dcdef8',
      AccentLight: '#032219',
      AccentDark: '#fdfeff',
      TextColor: '#fdfeff',
      BackgroundColor: '#32343e',
      ForegroundColor: '#4e5288',
      FormBackgroundColor: '#32343e',
      BorderRadius: '10px',
      BorderWidth: '3px',
      FontBaseSize: '14px',
    };
    const defaultStyles = isDarkTheme ? styleDefaultsDark : styleDefaultsLight;
    const storedStyles = localStorage.getItem('ms-azoaicc:customStyles');
    return storedStyles ? JSON.parse(storedStyles) : defaultStyles;
  });

  const handleCustomStylesChange = (newStyles: CustomStylesState) => {
    setCustomStyles(newStyles);
  };

  const handleThemeToggle = (newIsDarkTheme: boolean) => {
    // Get the ChatComponent instance (modify this according to how you manage your components)
    const chatComponent = document.querySelector('chat-component');
    if (chatComponent) {
      // Remove existing style attributes
      chatComponent.removeAttribute('style');
      // eslint-disable-next-line unicorn/prefer-dom-node-dataset
      chatComponent.setAttribute('data-theme', newIsDarkTheme ? 'dark' : '');
    }
    // Update the body class and html data-theme
    localStorage.removeItem('ms-azoaicc:customStyles');

    // Update the state
    setIsDarkTheme(newIsDarkTheme);
  };

  // Effect for storage changes and theme management
  useState(() => {
    // Store customStyles in local storage whenever it changes
    localStorage.setItem(
      'ms-azoaicc:customStyles',
      JSON.stringify(customStyles)
    );

    // Store isBrandingEnabled in local storage whenever it changes
    localStorage.setItem(
      'ms-azoaicc:isBrandingEnabled',
      JSON.stringify(isBrandingEnabled)
    );

    // Store isDarkTheme in local storage whenever it changes
    localStorage.setItem('ms-azoaicc:isDarkTheme', JSON.stringify(isDarkTheme));

    // Scroll into view when isLoading changes
    chatMessageStreamEnd.current?.scrollIntoView({ behavior: 'smooth' });
    // Toggle 'dark' class on the shell app body element based on the isDarkTheme prop and isConfigPanelOpen
    document.body.classList.toggle('dark', isDarkTheme);
    document.documentElement.dataset.theme = isDarkTheme ? 'dark' : '';
  });

  const [isChatStylesAccordionOpen, setIsChatStylesAccordionOpen] =
    useState(false);

  const overrides: RequestOverrides = {
    retrieval_mode: retrievalMode,
    top: retrieveCount,
    semantic_ranker: useSemanticRanker,
    semantic_captions: useSemanticCaptions,
    exclude_category: excludeCategory,
    prompt_template: promptTemplate,
    prompt_template_prefix: '',
    prompt_template_suffix: '',
    suggest_followup_questions: useSuggestFollowupQuestions,
  };

  return (
    <div className={styles.container}>
      <div className={styles.chatHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.chatTitle}>Your AI Coach</h1>
          <p className={styles.chatSubtitle}>
            Ready to help you grow, learn, and achieve your goals.
          </p>
          <div className={styles.personalityDropdown}>
            <label
              htmlFor="personality-select"
              className={styles.personalityLabel}
            >
              Coaching Personality:
            </label>
            <select
              id="personality-select"
              className={styles.personalitySelect}
              value={selectedPersonalityId || ''}
              onChange={(event) =>
                setSelectedPersonalityId(Number(event.target.value))
              }
              disabled={personalitiesLoading || personalities.length === 0}
              aria-label="Select coaching personality"
              title={
                personalities.length === 0
                  ? 'No personalities available'
                  : personalities.find((p) => p.id === selectedPersonalityId)
                      ?.promptText || ''
              }
            >
              {personalitiesLoading && (
                <option value="">Loading personalities...</option>
              )}
              {!personalitiesLoading && personalities.length === 0 && (
                <option value="">No personalities available</option>
              )}
              {!personalitiesLoading &&
                personalities.length > 0 &&
                personalities.map((personality) => (
                  <option
                    key={personality.id}
                    value={personality.id}
                    title={personality.promptText}
                  >
                    {personality.name}
                    {personality.isDefault ? ' (Default)' : ''}
                  </option>
                ))}
            </select>
          </div>
        </div>
        {isAdmin && (
          <div className={styles.headerActions}>
            <SettingsButton
              className={styles.settingsButton}
              onClick={() => setIsConfigPanelOpen(!isConfigPanelOpen)}
            />
          </div>
        )}
      </div>

      <div className={styles.chatContent}>
        <div className={styles.welcomeSection}>
          <h2 className={styles.welcomeText}>
            How can I help{user?.name ? `, ${user.name.split(' ')[0]}` : ''}?
          </h2>
          <div className={styles.starterPrompts}>
            {STARTER_PROMPTS.map((prompt, index) => (
              <button
                key={index}
                className={styles.starterPromptCard}
                onClick={() => handleStarterPromptClick(prompt)}
                type="button"
                aria-label={`Start conversation about: ${prompt}`}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.chatRoot}>
          <div className={styles.chatEmptyState}>
            {isLoadingHistory ? (
              <div className={styles.loadingState}>Loading chat history...</div>
            ) : (
              <>
                <chat-component
                  ref={chatComponentReference}
                  title=""
                  data-input-position="sticky"
                  data-interaction-model="chat"
                  data-api-url={apiBaseUrl}
                  data-use-stream={useStream}
                  data-approach="rrr"
                  data-overrides={JSON.stringify(overrides)}
                  data-custom-styles={JSON.stringify(customStyles)}
                  data-custom-branding={JSON.stringify(isBrandingEnabled)}
                  data-theme={isDarkTheme ? 'dark' : ''}
                  data-chat-id={currentChatId?.toString() || ''}
                  data-personality-id={selectedPersonalityId?.toString() || ''}
                ></chat-component>

                {/* Display citations below the chat if available */}
                {lastCitations.length > 0 && (
                  <div className={styles.citationsContainer}>
                    <CitationsList citations={lastCitations} />
                  </div>
                )}

                {/* Show personality indicator */}
                <div className={styles.personalityIndicatorContainer}>
                  <PersonalityIndicator />
                </div>
              </>
            )}
          </div>
        </div>

        {/* RAG Visualizer */}
        <RAGVisualizer isActive={isRagActive} sourcesCount={ragSourcesCount} />
      </div>

      <Panel
        headerText="Configure answer generation"
        isOpen={isConfigPanelOpen}
        isBlocking={false}
        onDismiss={() => setIsConfigPanelOpen(false)}
        closeButtonAriaLabel="Close"
        onRenderFooterContent={() => (
          <DefaultButton onClick={() => setIsConfigPanelOpen(false)}>
            Close
          </DefaultButton>
        )}
        isFooterAtBottom={true}
      >
        <TooltipHost
          calloutProps={toolTipTextCalloutProps}
          content={toolTipText.promptTemplate}
        >
          <ThemeSwitch
            onToggle={handleThemeToggle}
            isDarkTheme={isDarkTheme}
            isConfigPanelOpen={isConfigPanelOpen}
          />
        </TooltipHost>
        <TooltipHost
          calloutProps={toolTipTextCalloutProps}
          content={toolTipText.promptTemplate}
        >
          <TextField
            className={styles.chatSettingsSeparator}
            defaultValue={promptTemplate}
            label="Override prompt template"
            multiline
            autoAdjustHeight
            onChange={onPromptTemplateChange}
          />
        </TooltipHost>

        <TooltipHost
          calloutProps={toolTipTextCalloutProps}
          content={toolTipText.retrieveNumber}
        >
          <SpinButton
            className={styles.chatSettingsSeparator}
            label="Retrieve this many search results:"
            min={1}
            max={50}
            defaultValue={retrieveCount.toString()}
            onChange={onRetrieveCountChange}
          />
        </TooltipHost>
        <TooltipHost
          calloutProps={toolTipTextCalloutProps}
          content={toolTipText.excludeCategory}
        >
          <TextField
            className={styles.chatSettingsSeparator}
            label="Exclude category"
            onChange={onExcludeCategoryChanged}
          />
        </TooltipHost>
        <TooltipHost
          calloutProps={toolTipTextCalloutProps}
          content={toolTipText.useSemanticRanker}
        >
          <Checkbox
            className={styles.chatSettingsSeparator}
            checked={useSemanticRanker}
            label="Use semantic ranker for retrieval"
            onChange={onUseSemanticRankerChange}
          />
        </TooltipHost>
        <TooltipHost
          calloutProps={toolTipTextCalloutProps}
          content={toolTipText.useQueryContextSummaries}
        >
          <Checkbox
            className={styles.chatSettingsSeparator}
            checked={useSemanticCaptions}
            label="Use query-contextual summaries instead of whole documents"
            onChange={onUseSemanticCaptionsChange}
            disabled={!useSemanticRanker}
          />
        </TooltipHost>
        <TooltipHost
          calloutProps={toolTipTextCalloutProps}
          content={toolTipText.suggestFollowupQuestions}
        >
          <Checkbox
            className={styles.chatSettingsSeparator}
            checked={useSuggestFollowupQuestions}
            label="Suggest follow-up questions"
            onChange={onUseSuggestFollowupQuestionsChange}
          />
        </TooltipHost>
        <TooltipHost
          calloutProps={toolTipTextCalloutProps}
          content={toolTipText.retrievalMode}
        >
          <Dropdown
            className={styles.chatSettingsSeparator}
            label="Retrieval mode"
            options={[
              {
                key: 'hybrid',
                text: 'Vectors + Text (Hybrid)',
                selected: retrievalMode == RetrievalMode.Hybrid,
                data: RetrievalMode.Hybrid,
              },
              {
                key: 'vectors',
                text: 'Vectors',
                selected: retrievalMode == RetrievalMode.Vectors,
                data: RetrievalMode.Vectors,
              },
              {
                key: 'text',
                text: 'Text',
                selected: retrievalMode == RetrievalMode.Text,
                data: RetrievalMode.Text,
              },
            ]}
            required
            onChange={onRetrievalModeChange}
          />
        </TooltipHost>
        <TooltipHost
          calloutProps={toolTipTextCalloutProps}
          content={toolTipText.streamChat}
        >
          <Checkbox
            className={styles.chatSettingsSeparator}
            checked={useStream}
            label="Stream chat completion responses"
            onChange={onUseStreamChange}
          />
        </TooltipHost>
        <div>
          <Toggle
            label="Customize chat styles"
            checked={isChatStylesAccordionOpen}
            onChange={() =>
              setIsChatStylesAccordionOpen(!isChatStylesAccordionOpen)
            }
          />
          {isChatStylesAccordionOpen && (
            <>
              <TooltipHost
                calloutProps={toolTipTextCalloutProps}
                content={toolTipText.promptTemplate}
              >
                <SettingsStyles
                  onChange={handleCustomStylesChange}
                ></SettingsStyles>
              </TooltipHost>
            </>
          )}
          <TooltipHost
            calloutProps={toolTipTextCalloutProps}
            content={toolTipText.promptTemplate}
          >
            <Toggle
              label="Enable Branding"
              checked={isBrandingEnabled}
              onChange={onEnableBrandingChange}
            />
          </TooltipHost>
        </div>
      </Panel>
    </div>
  );
};

export default Chat;
