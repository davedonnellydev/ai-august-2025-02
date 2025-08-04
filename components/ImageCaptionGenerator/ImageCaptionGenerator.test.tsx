import { render, screen, userEvent } from '@/test-utils';
import { ImageCaptionGenerator } from './ImageCaptionGenerator';

// Mock the ClientRateLimiter
jest.mock('../../app/lib/utils/api-helpers', () => ({
  ClientRateLimiter: {
    getRemainingRequests: jest.fn(() => 10),
    checkLimit: jest.fn(() => true),
    incrementRequest: jest.fn(),
  },
}));

// Mock fetch
global.fetch = jest.fn();

describe('ImageCaptionGenerator component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the title correctly', () => {
    render(<ImageCaptionGenerator />);
    const title = screen.getByRole('heading', { level: 1 });
    expect(title).toHaveTextContent('Image Caption Generator');
  });

  it('renders image input fields and buttons', () => {
    render(<ImageCaptionGenerator />);
    expect(screen.getByLabelText('Image URL')).toBeInTheDocument();
    expect(screen.getByText('Or Upload Image File')).toBeInTheDocument();
    expect(screen.getByText('Generate Caption')).toBeInTheDocument();
    expect(screen.getByText('Reset All')).toBeInTheDocument();
  });

  it('displays remaining requests count', () => {
    render(<ImageCaptionGenerator />);
    expect(
      screen.getByText(/You have \d+ image caption generations remaining/)
    ).toBeInTheDocument();
  });

  it('allows user to enter image URL', async () => {
    const user = userEvent.setup();
    render(<ImageCaptionGenerator />);

    const input = screen.getByLabelText('Image URL');
    await user.type(input, 'https://example.com/image.jpg');

    expect(input).toHaveValue('https://example.com/image.jpg');
  });

  it('has generate button', () => {
    render(<ImageCaptionGenerator />);

    const submitButton = screen.getByText('Generate Caption');
    expect(submitButton).toBeInTheDocument();
  });

  it('resets form when reset button is clicked', async () => {
    const user = userEvent.setup();
    render(<ImageCaptionGenerator />);

    const input = screen.getByLabelText('Image URL');
    const resetButton = screen.getByText('Reset All');

    await user.type(input, 'https://example.com/image.jpg');
    await user.click(resetButton);

    expect(input).toHaveValue('');
  });

  it('displays caption settings section', () => {
    render(<ImageCaptionGenerator />);
    expect(screen.getByText('Caption Settings')).toBeInTheDocument();
    expect(screen.getByText('Maximum Words: 20')).toBeInTheDocument();
    expect(screen.getByText('Caption Tone')).toBeInTheDocument();
  });

  it('displays tone selection chips', () => {
    render(<ImageCaptionGenerator />);
    expect(screen.getByText('Professional')).toBeInTheDocument();
    expect(screen.getByText('Fun')).toBeInTheDocument();
    expect(screen.getByText('Poetic')).toBeInTheDocument();
    expect(screen.getByText('Casual')).toBeInTheDocument();
  });
});
