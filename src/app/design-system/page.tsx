'use client';

import React, { useState } from 'react';
import {
  gray, blue, purple, violet, green, emerald, red, amber, orange, cyan, pink, fuchsia,
  semantic, gradients, highlights,
} from '@/design-system/tokens/colors';
import { fontFamily, fontSize, fontWeight, lineHeight, letterSpacing, presets } from '@/design-system/tokens/typography';
import { spacing, namedSpacing, componentSpacing } from '@/design-system/tokens/spacing';
import { borderRadius, borderWidth, borderPresets } from '@/design-system/tokens/borders';
import { boxShadow, buttonShadow, coloredShadow } from '@/design-system/tokens/shadows';
import { duration, easing, transition } from '@/design-system/tokens/animations';
import { designSystemMeta } from '@/design-system';

type TabId = 'colors' | 'typography' | 'spacing' | 'borders' | 'shadows' | 'animations' | 'components';

export default function DesignSystemPage() {
  const [activeTab, setActiveTab] = useState<TabId>('colors');

  const tabs: { id: TabId; label: string }[] = [
    { id: 'colors', label: 'Colors' },
    { id: 'typography', label: 'Typography' },
    { id: 'spacing', label: 'Spacing' },
    { id: 'borders', label: 'Borders' },
    { id: 'shadows', label: 'Shadows' },
    { id: 'animations', label: 'Animations' },
    { id: 'components', label: 'Components' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b-2 border-black dark:border-gray-600 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">
            {designSystemMeta.name}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            v{designSystemMeta.version} · {designSystemMeta.description}
          </p>
        </div>

        {/* Tabs */}
        <nav className="max-w-7xl mx-auto px-6 flex gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-bold uppercase tracking-wide transition-colors border-b-3 -mb-[2px] ${
                activeTab === tab.id
                  ? 'border-black dark:border-white text-black dark:text-white'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'colors' && <ColorsSection />}
        {activeTab === 'typography' && <TypographySection />}
        {activeTab === 'spacing' && <SpacingSection />}
        {activeTab === 'borders' && <BordersSection />}
        {activeTab === 'shadows' && <ShadowsSection />}
        {activeTab === 'animations' && <AnimationsSection />}
        {activeTab === 'components' && <ComponentsSection />}
      </main>
    </div>
  );
}

// ============================================================================
// COLORS SECTION
// ============================================================================

function ColorsSection() {
  const colorPalettes = [
    { name: 'Gray', colors: gray },
    { name: 'Blue', colors: blue },
    { name: 'Purple', colors: purple },
    { name: 'Violet', colors: violet },
    { name: 'Green', colors: green },
    { name: 'Emerald', colors: emerald },
    { name: 'Red', colors: red },
    { name: 'Amber', colors: amber },
    { name: 'Orange', colors: orange },
    { name: 'Cyan', colors: cyan },
    { name: 'Pink', colors: pink },
    { name: 'Fuchsia', colors: fuchsia },
  ];

  return (
    <div className="space-y-12">
      <Section title="Color Palettes">
        <div className="space-y-8">
          {colorPalettes.map((palette) => (
            <div key={palette.name}>
              <h4 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">{palette.name}</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(palette.colors).map(([shade, value]) => (
                  <ColorSwatch key={shade} name={`${shade}`} value={value} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Semantic Colors">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(semantic).map(([name, value]) => (
            <ColorSwatch key={name} name={name} value={value} showLabel />
          ))}
        </div>
      </Section>

      <Section title="Gradients">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <GradientSwatch name="Violet (Wow Mode)" gradient={gradients.wowMode.violet.default} />
          <GradientSwatch name="Fuchsia (Wow Mode)" gradient={gradients.wowMode.fuchsia.default} />
          <GradientSwatch name="Emerald (Wow Mode)" gradient={gradients.wowMode.emerald.default} />
          <GradientSwatch name="Modified Badge" gradient={gradients.badge.modified} />
          <GradientSwatch name="Warning Badge" gradient={gradients.badge.warning} />
          <GradientSwatch name="Codex Badge" gradient={gradients.badge.codex} />
        </div>
      </Section>

      <Section title="Highlight Colors">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <HighlightSwatch name="JSON" highlight={highlights.json} />
          <HighlightSwatch name="XLSX" highlight={highlights.xlsx} />
          <HighlightSwatch name="Character" highlight={highlights.character} />
          <HighlightSwatch name="Clickable" highlight={highlights.clickable} />
        </div>
      </Section>
    </div>
  );
}

function ColorSwatch({ name, value, showLabel = false }: { name: string; value: string; showLabel?: boolean }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <button
      onClick={handleCopy}
      className="group flex flex-col items-center"
      title={`Click to copy: ${value}`}
    >
      <div
        className="w-16 h-16 rounded border-2 border-black dark:border-gray-600 transition-transform group-hover:scale-105"
        style={{ backgroundColor: value }}
      />
      <span className="text-xs font-medium mt-1 text-gray-600 dark:text-gray-400">
        {copied ? '✓' : showLabel ? name : name}
      </span>
    </button>
  );
}

function GradientSwatch({ name, gradient }: { name: string; gradient: string }) {
  return (
    <div className="space-y-2">
      <div
        className="h-20 rounded border-2 border-black dark:border-gray-600"
        style={{ background: gradient }}
      />
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{name}</p>
    </div>
  );
}

function HighlightSwatch({ name, highlight }: { name: string; highlight: typeof highlights.json }) {
  return (
    <div className="space-y-2">
      <div
        className="h-16 rounded border-2 flex items-center justify-center text-sm font-medium"
        style={{
          backgroundColor: highlight.background,
          borderColor: highlight.border,
          color: highlight.border
        }}
      >
        Highlighted Text
      </div>
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{name}</p>
    </div>
  );
}

// ============================================================================
// TYPOGRAPHY SECTION
// ============================================================================

function TypographySection() {
  return (
    <div className="space-y-12">
      <Section title="Font Families">
        <div className="space-y-4">
          {Object.entries(fontFamily).map(([name, value]) => (
            <div key={name} className="p-4 bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-600 rounded">
              <p className="text-2xl mb-2" style={{ fontFamily: value }}>
                The quick brown fox jumps over the lazy dog
              </p>
              <code className="text-xs text-gray-500">{name}: {value.slice(0, 50)}...</code>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Font Sizes">
        <div className="space-y-3">
          {Object.entries(fontSize).map(([name, value]) => (
            <div key={name} className="flex items-baseline gap-4">
              <code className="text-xs text-gray-500 w-16">{name}</code>
              <span style={{ fontSize: value }} className="text-gray-900 dark:text-white font-medium">
                {value} - The quick brown fox
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Font Weights">
        <div className="space-y-3">
          {Object.entries(fontWeight).map(([name, value]) => (
            <div key={name} className="flex items-center gap-4">
              <code className="text-xs text-gray-500 w-20">{name}</code>
              <span style={{ fontWeight: value }} className="text-xl text-gray-900 dark:text-white">
                {value} - The quick brown fox
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Line Heights">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(lineHeight).map(([name, value]) => (
            <div key={name} className="p-4 bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-600 rounded">
              <code className="text-xs text-gray-500 mb-2 block">{name}: {value}</code>
              <p style={{ lineHeight: value }} className="text-gray-700 dark:text-gray-300">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Letter Spacing">
        <div className="space-y-3">
          {Object.entries(letterSpacing).map(([name, value]) => (
            <div key={name} className="flex items-center gap-4">
              <code className="text-xs text-gray-500 w-20">{name}</code>
              <span style={{ letterSpacing: value }} className="text-xl text-gray-900 dark:text-white uppercase">
                Letter Spacing
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Typography Presets">
        <div className="space-y-6">
          {Object.entries(presets).map(([name, preset]) => (
            <div key={name} className="p-4 bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-600 rounded">
              <code className="text-xs text-gray-500 mb-2 block">{name}</code>
              <p
                style={{
                  fontFamily: preset.fontFamily,
                  fontSize: preset.fontSize,
                  fontWeight: preset.fontWeight,
                  lineHeight: preset.lineHeight,
                  letterSpacing: preset.letterSpacing,
                  textTransform: 'textTransform' in preset ? preset.textTransform : undefined,
                }}
                className="text-gray-900 dark:text-white"
              >
                The quick brown fox jumps over the lazy dog
              </p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

// ============================================================================
// SPACING SECTION
// ============================================================================

function SpacingSection() {
  return (
    <div className="space-y-12">
      <Section title="Spacing Scale">
        <div className="space-y-2">
          {Object.entries(spacing).map(([name, value]) => (
            <div key={name} className="flex items-center gap-4">
              <code className="text-xs text-gray-500 w-12">{name}</code>
              <div
                className="h-6 bg-blue-500 rounded"
                style={{ width: value === '0' ? '2px' : value }}
              />
              <span className="text-xs text-gray-500">{value}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Named Spacing">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(namedSpacing).map(([name, value]) => (
            <div key={name} className="p-4 bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-600 rounded">
              <code className="text-xs text-gray-500 block mb-2">{name}</code>
              <div className="flex items-end gap-2">
                <div className="w-8 bg-purple-500 rounded" style={{ height: value }} />
                <span className="text-sm font-medium">{value}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Component Spacing">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-600 rounded">
            <h4 className="font-bold mb-4">Button Padding</h4>
            <div className="space-y-4">
              {Object.entries(componentSpacing.button).map(([size, padding]) => (
                <div key={size}>
                  <code className="text-xs text-gray-500 block mb-1">{size}</code>
                  <button
                    className="bg-gray-900 text-white font-bold rounded border-2 border-black"
                    style={{ padding: `${padding.y} ${padding.x}` }}
                  >
                    Button {size.toUpperCase()}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-600 rounded">
            <h4 className="font-bold mb-4">Input Padding</h4>
            <input
              type="text"
              placeholder="Input field"
              className="w-full border-2 border-black rounded text-gray-900"
              style={{ padding: `${componentSpacing.input.y} ${componentSpacing.input.x}` }}
            />
            <code className="text-xs text-gray-500 mt-2 block">
              x: {componentSpacing.input.x}, y: {componentSpacing.input.y}
            </code>
          </div>
        </div>
      </Section>
    </div>
  );
}

// ============================================================================
// BORDERS SECTION
// ============================================================================

function BordersSection() {
  return (
    <div className="space-y-12">
      <Section title="Border Radius">
        <div className="flex flex-wrap gap-4">
          {Object.entries(borderRadius).map(([name, value]) => (
            <div key={name} className="flex flex-col items-center">
              <div
                className="w-20 h-20 bg-blue-500 border-2 border-black"
                style={{ borderRadius: value }}
              />
              <code className="text-xs text-gray-500 mt-2">{name}</code>
              <span className="text-xs text-gray-400">{value}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Border Width">
        <div className="flex flex-wrap gap-4">
          {Object.entries(borderWidth).map(([name, value]) => (
            <div key={name} className="flex flex-col items-center">
              <div
                className="w-20 h-20 bg-gray-100 dark:bg-gray-700 border-black dark:border-white"
                style={{ borderWidth: value, borderStyle: 'solid' }}
              />
              <code className="text-xs text-gray-500 mt-2">{name}</code>
              <span className="text-xs text-gray-400">{value}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Border Presets">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(borderPresets).map(([name, preset]) => {
            if ('light' in preset && typeof preset.light === 'string') {
              return (
                <div key={name} className="p-6 bg-white dark:bg-gray-800" style={{ border: preset.light }}>
                  <code className="text-xs text-gray-500">{name}</code>
                </div>
              );
            }
            return null;
          })}
        </div>
      </Section>
    </div>
  );
}

// ============================================================================
// SHADOWS SECTION
// ============================================================================

function ShadowsSection() {
  return (
    <div className="space-y-12">
      <Section title="Box Shadows">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Object.entries(boxShadow).map(([name, value]) => (
            <div key={name} className="flex flex-col items-center">
              <div
                className="w-24 h-24 bg-white dark:bg-gray-800 rounded"
                style={{ boxShadow: value }}
              />
              <code className="text-xs text-gray-500 mt-3">{name}</code>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Button Shadows">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Object.entries(buttonShadow).map(([name, value]) => (
            <div key={name} className="flex flex-col items-center">
              <div
                className="w-24 h-12 bg-gray-900 dark:bg-white rounded flex items-center justify-center"
                style={{ boxShadow: value }}
              >
                <span className="text-white dark:text-gray-900 text-xs font-bold">Button</span>
              </div>
              <code className="text-xs text-gray-500 mt-3">{name}</code>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Colored Shadows">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-violet-500 rounded" style={{ boxShadow: coloredShadow.violet.lg }} />
            <code className="text-xs text-gray-500 mt-3">violet</code>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-fuchsia-500 rounded" style={{ boxShadow: coloredShadow.fuchsia.lg }} />
            <code className="text-xs text-gray-500 mt-3">fuchsia</code>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-emerald-500 rounded" style={{ boxShadow: coloredShadow.emerald.lg }} />
            <code className="text-xs text-gray-500 mt-3">emerald</code>
          </div>
        </div>
      </Section>
    </div>
  );
}

// ============================================================================
// ANIMATIONS SECTION
// ============================================================================

function AnimationsSection() {
  const [isAnimating, setIsAnimating] = useState(false);

  return (
    <div className="space-y-12">
      <Section title="Durations">
        <div className="space-y-3">
          {Object.entries(duration).map(([name, value]) => (
            <div key={name} className="flex items-center gap-4">
              <code className="text-xs text-gray-500 w-20">{name}</code>
              <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded"
                  style={{
                    width: `${(value / 500) * 100}%`,
                  }}
                />
              </div>
              <span className="text-xs text-gray-500 w-16">{value}ms</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Easings">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(easing).map(([name, value]) => (
            <div key={name} className="p-4 bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-600 rounded">
              <code className="text-xs text-gray-500 block mb-3">{name}</code>
              <button
                className="w-full py-2 bg-blue-500 text-white font-bold rounded transition-transform"
                style={{
                  transitionTimingFunction: value,
                  transitionDuration: '300ms',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                Hover me
              </button>
              <code className="text-xs text-gray-400 mt-2 block truncate">{value}</code>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Transitions">
        <div className="space-y-4">
          {Object.entries(transition).map(([name, value]) => (
            <div key={name} className="p-4 bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-600 rounded">
              <code className="text-xs text-gray-500 block mb-2">{name}</code>
              <code className="text-xs text-gray-400 block">{value}</code>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Interactive Demo">
        <div className="p-6 bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-600 rounded">
          <button
            onClick={() => setIsAnimating(!isAnimating)}
            className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded border-2 border-black transition-all"
            style={{
              transition: transition.buttonSpring,
              transform: isAnimating ? 'scale(1.1) translateY(-4px)' : 'scale(1)',
              boxShadow: isAnimating ? buttonShadow.springHover : buttonShadow.default,
            }}
          >
            {isAnimating ? 'Animated!' : 'Click to Animate'}
          </button>
        </div>
      </Section>
    </div>
  );
}

// ============================================================================
// COMPONENTS SECTION
// ============================================================================

function ComponentsSection() {
  return (
    <div className="space-y-12">
      <Section title="Buttons">
        <div className="flex flex-wrap gap-4">
          <button className="px-6 py-3 bg-gray-900 text-white font-black uppercase tracking-tight rounded border-2 border-black transition-all hover:scale-102 hover:-translate-y-0.5 active:scale-98">
            Primary
          </button>
          <button className="px-6 py-3 bg-white text-gray-900 font-black uppercase tracking-tight rounded border-2 border-black transition-all hover:scale-102 hover:-translate-y-0.5 active:scale-98">
            Secondary
          </button>
          <button className="px-6 py-3 bg-gradient-to-br from-violet-500 to-purple-600 text-white font-black uppercase tracking-tight rounded border-2 border-black transition-all hover:scale-102 hover:-translate-y-0.5 active:scale-98">
            Gradient
          </button>
          <button className="px-6 py-3 bg-red-500 text-white font-black uppercase tracking-tight rounded border-2 border-black transition-all hover:scale-102 hover:-translate-y-0.5 active:scale-98">
            Danger
          </button>
        </div>
      </Section>

      <Section title="Inputs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Text Input
            </label>
            <input
              type="text"
              placeholder="Enter text..."
              className="w-full px-4 py-3 border-2 border-black dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-3 focus:ring-blue-500/30"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Textarea
            </label>
            <textarea
              placeholder="Enter longer text..."
              rows={3}
              className="w-full px-4 py-3 border-2 border-black dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-3 focus:ring-blue-500/30 resize-none"
            />
          </div>
        </div>
      </Section>

      <Section title="Cards">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-600 rounded">
            <h4 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Basic Card</h4>
            <p className="text-gray-600 dark:text-gray-400">Standard card with border and padding.</p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 rounded shadow-lg">
            <h4 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Shadow Card</h4>
            <p className="text-gray-600 dark:text-gray-400">Card with shadow instead of border.</p>
          </div>
          <div className="p-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded border-2 border-black">
            <h4 className="font-bold text-lg mb-2 text-white">Gradient Card</h4>
            <p className="text-white/80">Card with gradient background.</p>
          </div>
        </div>
      </Section>

      <Section title="Badges">
        <div className="flex flex-wrap gap-3">
          <span className="px-3 py-1 text-xs font-bold uppercase bg-blue-100 text-blue-700 rounded-full">
            Info
          </span>
          <span className="px-3 py-1 text-xs font-bold uppercase bg-green-100 text-green-700 rounded-full">
            Success
          </span>
          <span className="px-3 py-1 text-xs font-bold uppercase bg-amber-100 text-amber-700 rounded-full">
            Warning
          </span>
          <span className="px-3 py-1 text-xs font-bold uppercase bg-red-100 text-red-700 rounded-full">
            Error
          </span>
          <span className="px-3 py-1 text-xs font-bold uppercase bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-full">
            Modified
          </span>
          <span className="px-3 py-1 text-xs font-bold uppercase bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full">
            Codex
          </span>
        </div>
      </Section>

      <Section title="Progress Indicators">
        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-gray-700 dark:text-gray-300">Progress</span>
              <span className="text-gray-500">75%</span>
            </div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-green-500 rounded-full transition-all" />
            </div>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <div
                key={i}
                className={`h-8 flex-1 rounded ${i <= 7 ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`}
              />
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
}

// ============================================================================
// SHARED COMPONENTS
// ============================================================================

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white mb-6">
        {title}
      </h3>
      {children}
    </section>
  );
}
