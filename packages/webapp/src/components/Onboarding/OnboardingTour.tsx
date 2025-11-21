import React, { useState, useEffect } from 'react';
import { PrimaryButton, DefaultButton, IconButton, Icon } from '@fluentui/react';

interface OnboardingStep {
  title: string;
  description: string;
  icon: string;
  targetElement?: string;
}

interface OnboardingTourProps {
  onComplete: () => void;
  onSkip: () => void;
}

const onboardingSteps: OnboardingStep[] = [
  {
    title: 'Welcome to Apex Coach AI',
    description:
      'Transform your coaching content into an interactive AI expert. This tour will guide you through the key features of the platform.',
    icon: 'WavingHand',
  },
  {
    title: 'Chat with Your AI Coach',
    description:
      'Start a conversation with your AI coaching assistant. Ask questions and get personalized guidance backed by your content.',
    icon: 'Chat',
    targetElement: 'chat-interface',
  },
  {
    title: 'Choose Your Coaching Style',
    description:
      'Select from multiple AI personalities that adapt to different coaching approaches. Switch between empathetic, analytical, or motivational styles.',
    icon: 'Emoji2',
    targetElement: 'personality-selector',
  },
  {
    title: 'Library & Knowledge Base',
    description:
      'Upload and manage your coaching content. Videos, documents, and training materials are indexed to power your AI coach.',
    icon: 'Library',
    targetElement: 'library-link',
  },
  {
    title: 'Programs & Access Control',
    description:
      'Organize content into structured programs. Assign clients and coaches to specific programs for controlled access.',
    icon: 'Group',
    targetElement: 'programs-link',
  },
  {
    title: 'Ready to Get Started!',
    description:
      'You are all set! Begin by uploading your content or start chatting with your AI coach. You can always replay this tour from the settings menu.',
    icon: 'Rocket',
  },
];

export const OnboardingTour: React.FC<OnboardingTourProps> = ({ onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightPosition, setHighlightPosition] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  const currentStepData = onboardingSteps[currentStep];
  const isLastStep = currentStep === onboardingSteps.length - 1;
  const isFirstStep = currentStep === 0;

  useEffect(() => {
    if (currentStepData.targetElement) {
      const element = document.querySelector(`[data-tour="${currentStepData.targetElement}"]`);
      if (element) {
        const rect = element.getBoundingClientRect();
        setHighlightPosition({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height,
        });
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        setHighlightPosition(null);
      }
    } else {
      setHighlightPosition(null);
    }
  }, [currentStep, currentStepData.targetElement]);

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onSkip} />

      {/* Highlight spotlight for target elements */}
      {highlightPosition && (
        <div
          className="fixed z-40 border-4 border-blue-500 rounded-lg pointer-events-none"
          style={{
            top: `${highlightPosition.top - 8}px`,
            left: `${highlightPosition.left - 8}px`,
            width: `${highlightPosition.width + 16}px`,
            height: `${highlightPosition.height + 16}px`,
            boxShadow: '0 0 0 99999px rgba(0, 0, 0, 0.5)',
          }}
        />
      )}

      {/* Tour Card */}
      <div
        className="fixed z-50 bg-white rounded-lg shadow-2xl max-w-md w-full"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        {/* Close button */}
        <div className="absolute top-4 right-4">
          <IconButton iconProps={{ iconName: 'Cancel' }} onClick={onSkip} title="Close tour" />
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Icon iconName={currentStepData.icon} style={{ fontSize: 32, color: '#0078D4' }} />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-center mb-4">{currentStepData.title}</h2>

          {/* Description */}
          <p className="text-gray-600 text-center mb-6">{currentStepData.description}</p>

          {/* Progress indicators */}
          <div className="flex justify-center gap-2 mb-6">
            {onboardingSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep ? 'w-8 bg-blue-500' : 'w-2 bg-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between items-center">
            <div>{!isFirstStep && <DefaultButton text="Previous" onClick={handlePrevious} />}</div>
            <div className="flex gap-2">
              <DefaultButton text="Skip Tour" onClick={onSkip} />
              <PrimaryButton
                text={isLastStep ? 'Get Started' : 'Next'}
                onClick={handleNext}
                iconProps={isLastStep ? { iconName: 'Rocket' } : { iconName: 'ChevronRight' }}
              />
            </div>
          </div>

          {/* Step counter */}
          <div className="text-center text-sm text-gray-500 mt-4">
            Step {currentStep + 1} of {onboardingSteps.length}
          </div>
        </div>
      </div>
    </>
  );
};
