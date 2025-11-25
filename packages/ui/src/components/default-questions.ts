import { injectable } from 'inversify';
import { html } from 'lit';
import { globalConfig, teaserListTexts } from '../config/global-config.js';
import {
  ComposableReactiveControllerBase,
  container,
  ControllerType,
  type ChatInputController,
  type ChatInputFooterController,
} from './composable.js';

@injectable()
export class DefaultQuestionsInputController
  extends ComposableReactiveControllerBase
  implements ChatInputController
{
  position = 'top';

  render(handleInput: (input: string) => void) {
    const promptTemplate = html`
      <teaser-list-component
        .heading="${this.context.interactionModel === 'chat'
          ? teaserListTexts.HEADING_CHAT
          : teaserListTexts.HEADING_ASK}"
        .clickable="${true}"
        .actionLabel="${teaserListTexts.TEASER_CTA_LABEL}"
        @teaser-click="${(event) => handleInput(event?.detail?.value)}"
        .teasers="${teaserListTexts.DEFAULT_PROMPTS}"
      ></teaser-list-component>
    `;
    return globalConfig.IS_DEFAULT_PROMPTS_ENABLED &&
      !this.context.isChatStarted
      ? promptTemplate
      : '';
  }
}

@injectable()
export class DefaultQuestionFooterController
  extends ComposableReactiveControllerBase
  implements ChatInputFooterController
{
  render(handleClick: (event: Event) => void) {
    const footer = html`
      <div class="chat__containerFooter">
        <button
          type="button"
          @click="${handleClick}"
          class="defaults__span button"
        >
          ${globalConfig.DISPLAY_DEFAULT_PROMPTS_BUTTON}
        </button>
      </div>
    `;

    // Show footer button only when default prompts are enabled and chat hasn't started
    return globalConfig.IS_DEFAULT_PROMPTS_ENABLED &&
      !this.context.isChatStarted
      ? footer
      : '';
  }
}

container
  .bind<ChatInputController>(ControllerType.ChatInput)
  .to(DefaultQuestionsInputController);
container
  .bind<ChatInputFooterController>(ControllerType.ChatInputFooter)
  .to(DefaultQuestionFooterController);
