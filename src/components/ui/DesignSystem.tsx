import React, { useState } from 'react';
import { 
  Button, 
  Card, 
  Badge, 
  Heading, 
  Subheading, 
  Title, 
  Body, 
  Caption, 
  Label, 
  Monospace,
  Input,
  TextArea,
  Select
} from './index';

const DesignSystem: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');
  const [selectValue, setSelectValue] = useState('');

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''} bg-gray-50 dark:bg-gray-900 p-8 transition-colors duration-300`}>
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-12">
        <div className="flex justify-between items-center mb-8">
          <Heading>AM Design System</Heading>
          <Button onClick={toggleDarkMode} variant="outline" size="sm">
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </Button>
        </div>
        
        <Body className="text-gray-600 dark:text-gray-400">
          A comprehensive design system extracted from the AM Translations Helper app. 
          Features a minimalist black-and-white aesthetic with sophisticated UI components.
        </Body>
      </div>

      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Color Palette */}
        <section>
          <Subheading>Color Palette</Subheading>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="h-16 bg-black dark:bg-white mb-2"></div>
              <Caption>Primary</Caption>
            </Card>
            <Card className="p-4">
              <div className="h-16 bg-white dark:bg-gray-800 border border-black dark:border-gray-600 mb-2"></div>
              <Caption>Secondary</Caption>
            </Card>
            <Card className="p-4">
              <div className="h-16 bg-gray-100 dark:bg-gray-700 mb-2"></div>
              <Caption>Background</Caption>
            </Card>
            <Card className="p-4">
              <div className="h-16 bg-gray-50 dark:bg-gray-900 mb-2"></div>
              <Caption>Surface</Caption>
            </Card>
          </div>
        </section>

        {/* Typography */}
        <section>
          <Subheading>Typography</Subheading>
          <Card className="p-6 space-y-4">
            <div>
              <Heading>Heading (H1)</Heading>
              <Caption>Font weight: 900, Letter spacing: -0.025em</Caption>
            </div>
            <div>
              <Subheading>Subheading (H2)</Subheading>
              <Caption>Font weight: 700, Letter spacing: -0.025em</Caption>
            </div>
            <div>
              <Title>Title (H3)</Title>
              <Caption>Font weight: 700, Letter spacing: -0.025em</Caption>
            </div>
            <div>
              <Body>Body text with optimal line height and letter spacing for readability.</Body>
              <Caption>Font weight: 400, Letter spacing: -0.011em</Caption>
            </div>
            <div>
              <Label>Label Text</Label>
              <Caption>Uppercase, tracking-wide, font-medium</Caption>
            </div>
            <div>
              <Monospace>Monospace text for code and technical content</Monospace>
              <Caption>Font family: monospace</Caption>
            </div>
          </Card>
        </section>

        {/* Buttons */}
        <section>
          <Subheading>Buttons</Subheading>
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <Title className="mb-4">Variants</Title>
                <div className="flex flex-wrap gap-4">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                </div>
              </div>
              
              <div>
                <Title className="mb-4">Sizes</Title>
                <div className="flex flex-wrap gap-4 items-center">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </div>
              </div>
              
              <div>
                <Title className="mb-4">States</Title>
                <div className="flex flex-wrap gap-4">
                  <Button>Normal</Button>
                  <Button disabled>Disabled</Button>
                  <Button className="hover:scale-105">Hover</Button>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Form Elements */}
        <section>
          <Subheading>Form Elements</Subheading>
          <Card className="p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input 
                  label="Text Input"
                  placeholder="Enter text here..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                
                <Select 
                  label="Select Option"
                  value={selectValue}
                  onChange={(e) => setSelectValue(e.target.value)}
                >
                  <option value="">Choose an option</option>
                  <option value="option1">Option 1</option>
                  <option value="option2">Option 2</option>
                  <option value="option3">Option 3</option>
                </Select>
              </div>
              
              <TextArea 
                label="Text Area"
                placeholder="Enter longer text here..."
                rows={4}
                value={textareaValue}
                onChange={(e) => setTextareaValue(e.target.value)}
              />
            </div>
          </Card>
        </section>

        {/* Badges */}
        <section>
          <Subheading>Badges</Subheading>
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <Title className="mb-4">Variants</Title>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="default">Default</Badge>
                  <Badge variant="blue">Blue</Badge>
                  <Badge variant="purple">Purple</Badge>
                  <Badge variant="green">Green</Badge>
                  <Badge variant="red">Red</Badge>
                </div>
              </div>
              
              <div>
                <Title className="mb-4">Sizes</Title>
                <div className="flex flex-wrap gap-2 items-center">
                  <Badge size="sm">Small</Badge>
                  <Badge size="md">Medium</Badge>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Cards */}
        <section>
          <Subheading>Cards</Subheading>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card variant="default" className="p-6">
              <Title>Default Card</Title>
              <Body>Standard card with subtle shadow and border.</Body>
            </Card>
            
            <Card variant="elevated" className="p-6">
              <Title>Elevated Card</Title>
              <Body>Card with enhanced shadow for emphasis.</Body>
            </Card>
            
            <Card variant="bordered" className="p-6">
              <Title>Bordered Card</Title>
              <Body>Card with border focus and no shadow.</Body>
            </Card>
          </div>
        </section>

        {/* Animations */}
        <section>
          <Subheading>Animations</Subheading>
          <Card className="p-6">
            <div className="space-y-4">
              <div className="animate-fade-in">
                <Title>Fade In Animation</Title>
                <Body>This text fades in on page load.</Body>
              </div>
              
              <div className="h-16 bg-gradient-to-r from-blue-500 to-purple-500 animate-gradient-shift rounded"></div>
              <Caption>Gradient shift animation</Caption>
            </div>
          </Card>
        </section>

        {/* Usage Examples */}
        <section>
          <Subheading>Usage Examples</Subheading>
          <Card className="p-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <Title>User Profile</Title>
                  <Caption>john.doe@example.com</Caption>
                </div>
                <div className="flex gap-2">
                  <Badge variant="green">Active</Badge>
                  <Button size="sm" variant="outline">Edit</Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <Label>Settings</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Display Name" placeholder="Enter display name" />
                  <Select label="Theme">
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto</option>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button>Save Changes</Button>
                  <Button variant="outline">Cancel</Button>
                </div>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default DesignSystem; 