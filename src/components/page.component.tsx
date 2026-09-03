import type { ReactNode } from 'react'

import './page.component.css'

/** Props for {@link Page}. */
interface PageProps {
  /** Page content, typically a `Page.Header` and `Page.Content`. */
  children: ReactNode
}

/**
 * Root layout wrapper for a view. Use it to wrap every top-level page,
 * composed with `Page.Header` and `Page.Content`.
 *
 * @example
 * <Page>
 *   <Page.Header><h1>Projects</h1></Page.Header>
 *   <Page.Content>...</Page.Content>
 * </Page>
 */
function Page({ children }: PageProps) {
  return <div className="page">{children}</div>
}

/** Props for {@link Page.Header}. */
interface PageHeaderProps {
  /** Header content, typically `Page.Header.Left` and/or `Page.Header.Right`. */
  children: ReactNode
}

/**
 * Header section of a `Page`, typically holding the page title.
 *
 * @example
 * <Page.Header><h1>Planning</h1></Page.Header>
 */
function PageHeader({ children }: PageHeaderProps) {
  return <header className="page-header">{children}</header>
}

/** Props for {@link Page.Header.Left}. */
interface PageHeaderLeftProps {
  /** Left-aligned header content. */
  children: ReactNode
}

/**
 * Left-aligned section of a `Page.Header`. Can be used on its own or
 * alongside `Page.Header.Right`; layout stays correct either way.
 *
 * @example
 * <Page.Header>
 *   <Page.Header.Left><h1>Planning</h1></Page.Header.Left>
 * </Page.Header>
 */
function PageHeaderLeft({ children }: PageHeaderLeftProps) {
  return <div className="page-header-left">{children}</div>
}

/** Props for {@link Page.Header.Right}. */
interface PageHeaderRightProps {
  /** Right-aligned header content. */
  children: ReactNode
}

/**
 * Right-aligned section of a `Page.Header`. Can be used on its own or
 * alongside `Page.Header.Left`; layout stays correct either way.
 *
 * @example
 * <Page.Header>
 *   <Page.Header.Left><h1>Planning</h1></Page.Header.Left>
 *   <Page.Header.Right><button>New item</button></Page.Header.Right>
 * </Page.Header>
 */
function PageHeaderRight({ children }: PageHeaderRightProps) {
  return <div className="page-header-right">{children}</div>
}

PageHeader.Left = PageHeaderLeft
PageHeader.Right = PageHeaderRight

/** Props for {@link Page.Content}. */
interface PageContentProps {
  /** Main body content. */
  children: ReactNode
}

/**
 * Main content area of a `Page`, holding the primary body of the view.
 *
 * @example
 * <Page.Content><p>Details for this item go here.</p></Page.Content>
 */
function PageContent({ children }: PageContentProps) {
  return <div className="page-content">{children}</div>
}

Page.Header = PageHeader
Page.Content = PageContent

export default Page
