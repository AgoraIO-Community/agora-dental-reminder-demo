'use client';

import { ChevronDown } from 'lucide-react';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

const questions = [
  {
    "question": "How long does a session last?",
    "answer": "Each session ends automatically after 10 minutes; choose Start again to continue."
  },
  {
    "question": "How do I start a conversation?",
    "answer": "Choose Start dental reminder and allow microphone access when asked. Speak in English and describe what you need. You can mute or end the conversation with the voice controls."
  },
  {
    "question": "What should I say?",
    "answer": "Please remind me of the dental appointment. I may need to change the time."
  },
  {
    "question": "Which appointment does it remind me about?",
    "answer": "One fictional routine checkup at Agora Harbor Dental in Boston, on the following New York calendar day from 2 to 2:45 PM Eastern. The assistant gives the exact date; that appointment remains fixed throughout the conversation."
  },
  {
    "question": "Can I confirm, cancel or change the appointment?",
    "answer": "You can state whether you plan to attend and ask for a recap of a cancellation or rescheduling preference. Nothing is saved or sent to a clinic. No alternative slots are configured, and a preferred time is not a confirmed appointment."
  },
  {
    "question": "What should I prepare?",
    "answer": "The example says to arrive ten minutes early and prepare questions for clinic staff. For fasting, medication, treatment-specific preparation, costs or insurance, ask the actual clinic. No patient identifiers are needed in this practice."
  },
  {
    "question": "Can I change what I said?",
    "answer": "Yes. Correct a detail, ask for clarification or request a verbal recap. This demo keeps details only within the current conversation."
  },
  {
    "question": "What if my microphone does not work?",
    "answer": "Check microphone permission, your selected input device and mute status, then try Start dental reminder again."
  }
];

export function ScenarioFaq() {
  return (
    <DialogContent className="demo-inspector demo-faq-drawer">
      <DialogHeader className="demo-faq-heading">
        <DialogTitle>Frequently asked questions</DialogTitle>
        <DialogDescription>How to get started, what to ask, and what to expect.</DialogDescription>
      </DialogHeader>
      <div className="demo-faq-list">
        {questions.map(({ question, answer }) => (
          <details className="demo-faq-item" key={question}>
            <summary>
              <span>{question}</span>
              <ChevronDown className="demo-faq-chevron" size={16} aria-hidden="true" />
            </summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
    </DialogContent>
  );
}
