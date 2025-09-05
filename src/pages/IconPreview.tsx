import React from 'react';
import { Box, HStack, VStack, Heading, Text, Icon, Button } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const CapsuleIcon = ({ boxSize = 40 }: { boxSize?: number }) => (
  <Icon viewBox="0 0 48 24" boxSize={boxSize} aria-hidden>
    <rect x="2" y="4" width="44" height="16" rx="8" fill="#4FD1C5" />
    <rect x="2" y="4" width="22" height="16" rx="8" fill="#FFFFFF" />
    <rect x="2" y="4" width="44" height="16" rx="8" fill="none" stroke="#c9c9c9" strokeWidth="0.8" />
  </Icon>
);

const MortarPestleIcon = ({ boxSize = 40 }: { boxSize?: number }) => (
  <Icon viewBox="0 0 48 48" boxSize={boxSize} aria-hidden>
    {/* bowl */}
    <path d="M6 30c0 7 6 12 18 12s18-5 18-12H6z" fill="#4FD1C5" />
    {/* rim */}
    <ellipse cx="24" cy="24" rx="18" ry="6" fill="#CFF7F0" />
    {/* pestle */}
    <rect x="30" y="8" width="6" height="20" rx="3" transform="rotate(25 33 18)" fill="#FFFFFF" />
  </Icon>
);

const IconPreview: React.FC = () => {
  return (
    <Box p={8} textAlign="center">
      <Heading mb={6}>Icon preview — pick one</Heading>
      <HStack spacing={12} justify="center">
        <VStack spacing={4}>
          <CapsuleIcon boxSize={28} />
          <Text fontWeight={700}>1) Capsule</Text>
          <Text fontSize="sm" color="gray.600">Classic two-tone pill</Text>
        </VStack>

        <VStack spacing={4}>
          <MortarPestleIcon boxSize={28} />
          <Text fontWeight={700}>4) Mortar & Pestle</Text>
          <Text fontSize="sm" color="gray.600">Apothecary symbol</Text>
        </VStack>
      </HStack>

      <Box mt={8}>
        <Button as={RouterLink} to="/medication" colorScheme="teal" mr={4}>Back to medication</Button>
        <Button as={RouterLink} to="/" variant="ghost">Home</Button>
      </Box>
    </Box>
  );
};

export default IconPreview;
