import React from 'react';
import UserProfilePanel from '../components/User/UserProfilePanel';
import MedicationRequestForm from '../components/User/MedicationRequestForm';
import { SimpleGrid, Box, Heading } from '@chakra-ui/react';

const UserPage: React.FC = () => (
  <main aria-label="User page">
    <Heading as="h1" size="lg" mb={4}>Korisnički račun</Heading>
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
      <Box>
        <UserProfilePanel />
      </Box>
      <Box>
        <MedicationRequestForm />
      </Box>
    </SimpleGrid>
  </main>
);

export default UserPage;
