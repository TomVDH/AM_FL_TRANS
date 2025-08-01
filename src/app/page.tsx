import TranslationHelper from '@/components/TranslationHelper'

/**
 * Home Page Component
 * 
 * The main entry point of the AM Translations Helper application.
 * Renders the TranslationHelper component which contains all the
 * translation workflow functionality.
 * 
 * This minimal approach keeps the page component clean while
 * delegating all business logic to the TranslationHelper component.
 */
export default function Home() {
  return <TranslationHelper />
} 