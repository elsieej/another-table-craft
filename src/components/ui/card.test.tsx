import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card'

describe('Card', () => {
  it('renders a full composition without throwing', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
          <CardAction>Action</CardAction>
        </CardHeader>
        <CardContent>Content</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>
    )

    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Description')).toBeInTheDocument()
    expect(screen.getByText('Action')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })

  it('tags each part with its data-slot for consumer styling hooks', () => {
    render(
      <Card data-testid='card'>
        <CardHeader data-testid='header'>
          <CardTitle data-testid='title'>T</CardTitle>
          <CardDescription data-testid='desc'>D</CardDescription>
        </CardHeader>
        <CardContent data-testid='content'>C</CardContent>
        <CardFooter data-testid='footer'>F</CardFooter>
      </Card>
    )

    expect(screen.getByTestId('card')).toHaveAttribute('data-slot', 'card')
    expect(screen.getByTestId('header')).toHaveAttribute('data-slot', 'card-header')
    expect(screen.getByTestId('title')).toHaveAttribute('data-slot', 'card-title')
    expect(screen.getByTestId('desc')).toHaveAttribute('data-slot', 'card-description')
    expect(screen.getByTestId('content')).toHaveAttribute('data-slot', 'card-content')
    expect(screen.getByTestId('footer')).toHaveAttribute('data-slot', 'card-footer')
  })
})
