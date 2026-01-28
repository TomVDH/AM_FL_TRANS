import type { Preview } from '@storybook/nextjs-vite'
import '../src/app/globals.css'
import React from 'react'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#fef3c7' },
        { name: 'dark', value: '#1a1510' },
        { name: 'white', value: '#ffffff' },
        { name: 'gray', value: '#f3f4f6' },
      ],
    },
    viewport: {
      viewports: {
        mobile: { name: 'Mobile', styles: { width: '375px', height: '667px' } },
        tablet: { name: 'Tablet', styles: { width: '768px', height: '1024px' } },
        desktop: { name: 'Desktop', styles: { width: '1280px', height: '800px' } },
      },
    },
  },
  globalTypes: {
    darkMode: {
      description: 'Dark mode toggle',
      defaultValue: false,
      toolbar: {
        title: 'Dark Mode',
        items: [
          { value: false, icon: 'sun', title: 'Light' },
          { value: true, icon: 'moon', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const isDark = context.globals.darkMode

      // Apply dark class to html element for Tailwind
      React.useEffect(() => {
        if (isDark) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      }, [isDark])

      return React.createElement(
        'div',
        {
          className: `min-h-screen p-4 ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`,
        },
        React.createElement(Story)
      )
    },
  ],
}

export default preview
