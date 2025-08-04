'use client';

import { useEffect, useState, useRef } from 'react';
import {
  Button,
  Text,
  TextInput,
  Title,
  Slider,
  Chip,
  Group,
  Stack,
  Paper,
  Image,
  FileInput,
  Divider,
  Box,
  Center,
  rem,
} from '@mantine/core';
import { IconUpload, IconPhoto, IconX } from '@tabler/icons-react';
import { ClientRateLimiter } from '@/app/lib/utils/api-helpers';
import classes from './ImageCaptionGenerator.module.css';

type Tone = 'Professional' | 'Fun' | 'Poetic' | 'Casual';

export function ImageCaptionGenerator() {
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [maxWords, setMaxWords] = useState(20);
  const [selectedTone, setSelectedTone] = useState<Tone[]>([]);
  const [caption, setCaption] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [remainingRequests, setRemainingRequests] = useState(0);
  const fileInputRef = useRef<HTMLButtonElement>(null);

  // Update remaining requests on component mount
  useEffect(() => {
    setRemainingRequests(ClientRateLimiter.getRemainingRequests());
  }, []);

  // Handle image file selection
  const handleFileChange = (file: File | null) => {
    if (file) {
      setImageFile(file);
      setImageUrl(''); // Clear URL when file is selected

      // Create preview URL for the file
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setImagePreview('');
    }
  };

  // Handle image URL input
  const handleUrlChange = (url: string) => {
    setImageUrl(url);
    if (url) {
      setImageFile(null); // Clear file when URL is entered
      setImagePreview(url);
    } else {
      setImagePreview('');
    }
  };

  // Handle tone selection
  const handleToneChange = (value: string[]) => {
    setSelectedTone(value as Tone[]);
  };

  // Generate caption (placeholder for now)
  const handleGenerateCaption = async () => {
    if (!imageUrl && !imageFile) {
      setError('Please provide an image URL or upload an image file');
      return;
    }

    // Check rate limit before proceeding
    if (!ClientRateLimiter.checkLimit()) {
      setError('Rate limit exceeded. Please try again later.');
      setRemainingRequests(ClientRateLimiter.getRemainingRequests());
      return;
    }

    setIsLoading(true);
    setError('');

          try {
        // Create tone string for API
        const toneSet = selectedTone.length > 0 ? selectedTone.join(', ') : 'default';

        console.log(imageFile);

        // TODO: Implement actual API call here
        // For now, just simulate the API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Placeholder response
        const toneText = selectedTone.length > 0 ? selectedTone.join(' and ') : 'default';
        setCaption(`This is a ${toneText.toLowerCase()} caption with approximately ${maxWords} words for your image. The actual API integration will be implemented later.`);

      // Update remaining requests after successful generation
    //   setRemainingRequests(ClientRateLimiter.getRemainingRequests());
    } catch (err) {
      console.error('API error:', err);
      setError(err instanceof Error ? err.message : 'API failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset all inputs
  const handleReset = () => {
    setImageUrl('');
    setImageFile(null);
    setImagePreview('');
    setMaxWords(20);
    setSelectedTone([]);
    setCaption('');
    setError('');
  };

  // Clear image (either URL or file)
  const handleClearImage = () => {
    setImageUrl('');
    setImageFile(null);
    setImagePreview('');
  };

  return (
    <>
      <Title className={classes.title} ta="center" mt={100}>
        Image{' '}
        <Text inherit variant="gradient" component="span" gradient={{ from: 'pink', to: 'yellow' }}>
          Caption
        </Text>{' '}Generator
      </Title>

      <Box style={{ maxWidth: 800, margin: '20px auto', padding: '20px' }}>

          {/* Settings Section */}
          <Paper p="md" withBorder>
            <Title order={3} mb="md">Caption Settings</Title>

            <Stack gap="lg">
              {/* Word Count Slider */}
              <Box>
                <Text size="sm" fw={500} mb="xs">
                  Maximum Words: {maxWords}
                </Text>
                <Slider
                  value={maxWords}
                  onChange={setMaxWords}
                  min={1}
                  max={50}
                  step={1}
                  marks={[
                    { value: 1, label: '1' },
                    { value: 25, label: '25' },
                    { value: 50, label: '50' },
                  ]}
                  size="md"
                />
              </Box>

              {/* Tone Selection */}
              <Box>
                <Text size="sm" fw={500} mb="xs">
                  Caption Tone
                </Text>
                <Chip.Group multiple value={selectedTone} onChange={handleToneChange}>
                  <Group gap="xs">
                    <Chip value="Professional" variant="light">
                      Professional
                    </Chip>
                    <Chip value="Fun" variant="light">
                      Fun
                    </Chip>
                    <Chip value="Poetic" variant="light">
                      Poetic
                    </Chip>
                    <Chip value="Casual" variant="light">
                      Casual
                    </Chip>
                  </Group>
                </Chip.Group>
              </Box>
            </Stack>
          </Paper>

        <Stack gap="lg">
          {/* Image Input Section */}
          <Paper p="md" withBorder>
            <Title order={3} mb="md">Image Input</Title>

            <Stack gap="md">
              {/* URL Input */}
              <TextInput
                label="Image URL"
                placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                value={imageUrl}
                onChange={(event) => handleUrlChange(event.currentTarget.value)}
                disabled={!!imageFile}
              />

              {/* File Upload */}
              <FileInput
                label="Or Upload Image File"
                placeholder="Click to upload or drag and drop"
                accept="image/*"
                value={imageFile}
                onChange={handleFileChange}
                disabled={!!imageUrl}
                leftSection={<IconUpload size={16} />}
                ref={fileInputRef}
              />

              {/* Clear Image Button */}
              {(imageUrl || imageFile) && (
                <Button
                  variant="light"
                  color="red"
                  leftSection={<IconX size={16} />}
                  onClick={handleClearImage}
                  size="sm"
                >
                  Clear Image
                </Button>
              )}
            </Stack>
          </Paper>

          {/* Image Preview Section */}
          <Paper p="md" withBorder>
            <Title order={3} mb="md">Image Preview</Title>

            <Center>
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Preview"
                  style={{ maxWidth: '100%', maxHeight: 400 }}
                  fallbackSrc="data:image/svg+xml,%3csvg width='400' height='300' xmlns='http://www.w3.org/2000/svg'%3e%3ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='monospace' font-size='14' fill='%23ccc'%3eImage preview%3c/text%3e%3c/svg%3e"
                />
              ) : (
                <Box
                  style={{
                    width: '100%',
                    height: 300,
                    border: '2px dashed #ccc',
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f8f9fa',
                  }}
                >
                  <Stack align="center" gap="xs">
                    <IconPhoto size={48} color="#ccc" />
                    <Text c="dimmed" size="sm">
                      No image selected
                    </Text>
                    <Text c="dimmed" size="xs" ta="center">
                      Enter an image URL or upload a file above
                    </Text>
                  </Stack>
                </Box>
              )}
            </Center>
          </Paper>


          {/* Action Buttons */}
          <Group justify="center" gap="md">
            <Button
              variant="filled"
              color="cyan"
              onClick={handleGenerateCaption}
              loading={isLoading}
              disabled={!imageUrl && !imageFile}
              size="lg"
            >
              Generate Caption
            </Button>
            <Button
              variant="light"
              color="gray"
              onClick={handleReset}
              size="lg"
            >
              Reset All
            </Button>
          </Group>

          {/* Error Display */}
          {error && (
            <Paper p="md" withBorder style={{ borderColor: 'red' }}>
              <Text c="red" ta="center" size="sm">
                Error: {error}
              </Text>
            </Paper>
          )}

          {/* Caption Display */}
          {caption && (
            <Paper p="md" withBorder>
              <Title order={3} mb="md">Generated Caption</Title>
              <Text size="lg" style={{ lineHeight: 1.6 }}>
                {caption}
              </Text>
            </Paper>
          )}

          <Divider />

          {/* Remaining Requests */}
          <Text c="dimmed" ta="center" size="sm">
            You have {remainingRequests} image caption generations remaining.
          </Text>
        </Stack>
      </Box>
    </>
  );
}
