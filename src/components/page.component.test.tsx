import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import Page from './page.component'

describe('Page', () => {
  it('renders its children', () => {
    render(<Page>content</Page>)

    expect(screen.getByText('content')).toBeInTheDocument()
  })
})

describe('Page.Header', () => {
  it('renders its children', () => {
    render(<Page.Header>header</Page.Header>)

    expect(screen.getByText('header')).toBeInTheDocument()
  })
})

describe('Page.Header.Left', () => {
  it('renders its children', () => {
    render(<Page.Header.Left>left</Page.Header.Left>)

    expect(screen.getByText('left')).toBeInTheDocument()
  })
})

describe('Page.Header.Right', () => {
  it('renders its children', () => {
    render(<Page.Header.Right>right</Page.Header.Right>)

    expect(screen.getByText('right')).toBeInTheDocument()
  })
})

describe('Page.Content', () => {
  it('renders its children', () => {
    render(<Page.Content>body</Page.Content>)

    expect(screen.getByText('body')).toBeInTheDocument()
  })
})
