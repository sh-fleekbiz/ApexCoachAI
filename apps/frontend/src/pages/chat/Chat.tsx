import { useRef, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import styles from './Chat.module.css';
import { RetrievalMode, apiBaseUrl, type RequestOverrides, getChatMessages } from '../../api/index.js';
import { SettingsButton } from '../../components/SettingsButton/index.js';
import { Checkbox, DefaultButton, Dropdown, Panel, SpinButton, TextField, TooltipHost, Toggle } from '@fluentui/react';
import type { IDropdownOption } from '@fluentui/react/lib-commonjs/Dropdown';
import 'chat-component';
import { toolTipText, toolTipTextCalloutProps } from '../../i18n/tooltips.js';
import { SettingsStyles } from '../../components/SettingsStyles/SettingsStyles.js';
import type { CustomStylesState } from '../../components/SettingsStyles/SettingsStyles.js';
import { ThemeSwitch } from '../../components/ThemeSwitch/ThemeSwitch.js';
import { usePersonality } from '../../contexts/PersonalityContext.js';

// Starter prompts for coaching
const STARTER_PROMPTS = [
  'Work through a breakthrough challenge',
  'Rebuild connection at home',
  'Navigate a difficult conversation',
  'Transform anger into leadership',
];

const Chat = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isConfigPanelOpen, setIsConfigPanelOpen] = useState(false);
  const chatComponentReference = useRef<any>(null);
  const [currentChatId, setCurrentChatId] = useState<number | undefined>();
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
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
      window.removeEventListener('chat-created', handleChatCreated as EventListener);
    };
  }, [currentChatId, setSearchParams]);

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
            citations: Array.isArray(msg.citations) ? msg.citations : msg.citations ? JSON.parse(msg.citations) : [],
          }));
          chatComponent.loadMessages(formattedMessages);
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
  const [retrievalMode, setRetrievalMode] = useState<RetrievalMode>(RetrievalMode.Hybrid);
  const [useSemanticRanker, setUseSemanticRanker] = useState<boolean>(true);
  const [useStream, setUseStream] = useState<boolean>(true);
  const [useSemanticCaptions, setUseSemanticCaptions] = useState<boolean>(false);
  const [excludeCategory, setExcludeCategory] = useState<string>('');
  const [useSuggestFollowupQuestions, setUseSuggestFollowupQuestions] = useState<boolean>(true);

  const chatMessageStreamEnd = useRef<HTMLDivElement | null>(null);

  const [isBrandingEnabled, setEnableBranding] = useState(() => {
    const storedBranding = localStorage.getItem('ms-azoaicc:isBrandingEnabled');
    return storedBranding ? JSON.parse(storedBranding) : false;
  });

  const onPromptTemplateChange = (
    _event?: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string,
  ) => {
    setPromptTemplate(newValue || '');
  };

  const onRetrieveCountChange = (_event?: React.SyntheticEvent<HTMLElement, Event>, newValue?: string) => {
    setRetrieveCount(Number.parseInt(newValue || '3'));
  };

  const onRetrievalModeChange = (
    _event: React.FormEvent<HTMLDivElement>,
    option?: IDropdownOption<RetrievalMode> | undefined,
    _index?: number | undefined,
  ) => {
    setRetrievalMode(option?.data || RetrievalMode.Hybrid);
  };

  const onUseSemanticRankerChange = (_event?: React.FormEvent<HTMLElement | HTMLInputElement>, checked?: boolean) => {
    setUseSemanticRanker(!!checked);
  };

  const onUseSemanticCaptionsChange = (_event?: React.FormEvent<HTMLElement | HTMLInputElement>, checked?: boolean) => {
    setUseSemanticCaptions(!!checked);
  };

  const onUseStreamChange = (_event?: React.FormEvent<HTMLElement | HTMLInputElement>, checked?: boolean) => {
    setUseStream(!!checked);
  };

  const onExcludeCategoryChanged = (_event?: React.FormEvent, newValue?: string) => {
    setExcludeCategory(newValue || '');
  };

  const onEnableBrandingChange = (_event?: React.FormEvent<HTMLElement | HTMLInputElement>, checked?: boolean) => {
    setEnableBranding(!!checked);
  };

  const onUseSuggestFollowupQuestionsChange = (
    _event?: React.FormEvent<HTMLElement | HTMLInputElement>,
    checked?: boolean,
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
    localStorage.setItem('ms-azoaicc:customStyles', JSON.stringify(customStyles));

    // Store isBrandingEnabled in local storage whenever it changes
    localStorage.setItem('ms-azoaicc:isBrandingEnabled', JSON.stringify(isBrandingEnabled));

    // Store isDarkTheme in local storage whenever it changes
    localStorage.setItem('ms-azoaicc:isDarkTheme', JSON.stringify(isDarkTheme));

    // Scroll into view when isLoading changes
    chatMessageStreamEnd.current?.scrollIntoView({ behavior: 'smooth' });
    // Toggle 'dark' class on the shell app body element based on the isDarkTheme prop and isConfigPanelOpen
    document.body.classList.toggle('dark', isDarkTheme);
    document.documentElement.dataset.theme = isDarkTheme ? 'dark' : '';
  });

  const [isChatStylesAccordionOpen, setIsChatStylesAccordionOpen] = useState(false);

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
          <h1 className={styles.chatTitle}>From Anger to Calm Leader</h1>
          <p className={styles.chatSubtitle}>Your private space for honest growth and the Inside Out Method.</p>
          <div className={styles.personalityDropdown}>
            <label htmlFor="personality-select" className={styles.personalityLabel}>
              Personality:
            </label>
            <select
              id="personality-select"
              className={styles.personalitySelect}
              value={selectedPersonalityId || ''}
              onChange={(event) => setSelectedPersonalityId(Number(event.target.value))}
              disabled={personalitiesLoading || personalities.length === 0}
              aria-label="Select coaching personality"
            >
              {personalitiesLoading && <option value="">Loading personalities...</option>}
              {!personalitiesLoading && personalities.length === 0 && (
                <option value="">No personalities available</option>
              )}
              {!personalitiesLoading &&
                personalities.map((personality) => (
                  <option key={personality.id} value={personality.id}>
                    {personality.name}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <div className={styles.headerActions}>
          <SettingsButton className={styles.settingsButton} onClick={() => setIsConfigPanelOpen(!isConfigPanelOpen)} />
        </div>
      </div>

      <div className={styles.chatContent}>
        <div className={styles.welcomeSection}>
          <h2 className={styles.welcomeText}>How can I help, Johnson?</h2>
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
            )}
          </div>
        </div>
      </div>

      <Panel
        headerText="Configure answer generation"
        isOpen={isConfigPanelOpen}
        isBlocking={false}
        onDismiss={() => setIsConfigPanelOpen(false)}
        closeButtonAriaLabel="Close"
        onRenderFooterContent={() => <DefaultButton onClick={() => setIsConfigPanelOpen(false)}>Close</DefaultButton>}
        isFooterAtBottom={true}
      >
        <TooltipHost calloutProps={toolTipTextCalloutProps} content={toolTipText.promptTemplate}>
          <ThemeSwitch onToggle={handleThemeToggle} isDarkTheme={isDarkTheme} isConfigPanelOpen={isConfigPanelOpen} />
        </TooltipHost>
        <TooltipHost calloutProps={toolTipTextCalloutProps} content={toolTipText.promptTemplate}>
          <TextField
            className={styles.chatSettingsSeparator}
            defaultValue={promptTemplate}
            label="Override prompt template"
            multiline
            autoAdjustHeight
            onChange={onPromptTemplateChange}
          />
        </TooltipHost>

        <TooltipHost calloutProps={toolTipTextCalloutProps} content={toolTipText.retrieveNumber}>
          <SpinButton
            className={styles.chatSettingsSeparator}
            label="Retrieve this many search results:"
            min={1}
            max={50}
            defaultValue={retrieveCount.toString()}
            onChange={onRetrieveCountChange}
          />
        </TooltipHost>
        <TooltipHost calloutProps={toolTipTextCalloutProps} content={toolTipText.excludeCategory}>
          <TextField
            className={styles.chatSettingsSeparator}
            label="Exclude category"
            onChange={onExcludeCategoryChanged}
          />
        </TooltipHost>
        <TooltipHost calloutProps={toolTipTextCalloutProps} content={toolTipText.useSemanticRanker}>
          <Checkbox
            className={styles.chatSettingsSeparator}
            checked={useSemanticRanker}
            label="Use semantic ranker for retrieval"
            onChange={onUseSemanticRankerChange}
          />
        </TooltipHost>
        <TooltipHost calloutProps={toolTipTextCalloutProps} content={toolTipText.useQueryContextSummaries}>
          <Checkbox
            className={styles.chatSettingsSeparator}
            checked={useSemanticCaptions}
            label="Use query-contextual summaries instead of whole documents"
            onChange={onUseSemanticCaptionsChange}
            disabled={!useSemanticRanker}
          />
        </TooltipHost>
        <TooltipHost calloutProps={toolTipTextCalloutProps} content={toolTipText.suggestFollowupQuestions}>
          <Checkbox
            className={styles.chatSettingsSeparator}
            checked={useSuggestFollowupQuestions}
            label="Suggest follow-up questions"
            onChange={onUseSuggestFollowupQuestionsChange}
          />
        </TooltipHost>
        <TooltipHost calloutProps={toolTipTextCalloutProps} content={toolTipText.retrievalMode}>
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
              { key: 'text', text: 'Text', selected: retrievalMode == RetrievalMode.Text, data: RetrievalMode.Text },
            ]}
            required
            onChange={onRetrievalModeChange}
          />
        </TooltipHost>
        <TooltipHost calloutProps={toolTipTextCalloutProps} content={toolTipText.streamChat}>
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
            onChange={() => setIsChatStylesAccordionOpen(!isChatStylesAccordionOpen)}
          />
          {isChatStylesAccordionOpen && (
            <>
              <TooltipHost calloutProps={toolTipTextCalloutProps} content={toolTipText.promptTemplate}>
                <SettingsStyles onChange={handleCustomStylesChange}></SettingsStyles>
              </TooltipHost>
            </>
          )}
          <TooltipHost calloutProps={toolTipTextCalloutProps} content={toolTipText.promptTemplate}>
            <Toggle label="Enable Branding" checked={isBrandingEnabled} onChange={onEnableBrandingChange} />
          </TooltipHost>
        </div>
      </Panel>
    </div>
  );
};

export default Chat;
