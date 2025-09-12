import React, { useEffect, useState } from "react";
import { getStats } from "../../utils/api";
import { Stats } from "../../types/stats";
import {
  Box,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  VStack,
  Text,
  Spinner,
} from "@chakra-ui/react";

const StatsPanel: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getStats()
      .then(setStats)
      .catch(() => setError("Failed to load stats."))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <Box textAlign="center" py={8}>
        <Spinner size="lg" />
        <Text mt={3}>Učitavanje statistike...</Text>
      </Box>
    );
  if (error)
    return (
      <Box role="alert" aria-live="assertive" p={4} bg="red.50" borderRadius="md">
        <Text color="red.700">{error}</Text>
      </Box>
    );
  if (!stats) return null;

  return (
    <Box aria-label="Admin statistics panel">
      <Heading as="h2" size="lg" mb={4}>
        Statistics
      </Heading>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={6}>
        <Stat p={4} borderWidth={1} borderRadius="md" bg="gray.50">
          <StatLabel>Total users</StatLabel>
          <StatNumber>{stats.total_users}</StatNumber>
        </Stat>

        <Stat p={4} borderWidth={1} borderRadius="md" bg="gray.50">
          <StatLabel>Total meds</StatLabel>
          <StatNumber>{stats.total_meds}</StatNumber>
        </Stat>

        <Stat p={4} borderWidth={1} borderRadius="md" bg="gray.50">
          <StatLabel>Sent reminders</StatLabel>
          <StatNumber>{stats.sent_reminders}</StatNumber>
        </Stat>

        <Stat p={4} borderWidth={1} borderRadius="md" bg="gray.50">
          <StatLabel>Confirmed reminders</StatLabel>
          <StatNumber>{stats.confirmed_reminders}</StatNumber>
        </Stat>
      </SimpleGrid>

      <VStack align="stretch" spacing={4}>
        <Box p={4} borderWidth={1} borderRadius="md" bg="white">
          <Heading as="h3" size="md" mb={2}>
            Most loaded user
          </Heading>
          <Text>{stats.most_loaded_user ?? "N/A"}</Text>
        </Box>

        <Box p={4} borderWidth={1} borderRadius="md" bg="white">
          <Heading as="h3" size="md" mb={2}>
            Lijek relative
          </Heading>

          {stats.lijek_relative && Object.keys(stats.lijek_relative).length > 0 ? (
            <TableContainer>
              <Table size="sm" variant="simple">
                <Thead>
                  <Tr>
                    <Th>User ID</Th>
                    <Th isNumeric>Relative</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {Object.entries(stats.lijek_relative).map(([userId, rel]) => (
                    <Tr key={userId}>
                      <Td>{userId}</Td>
                      <Td isNumeric>{(rel * 100).toFixed(1)}%</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          ) : (
            <Text>N/A</Text>
          )}
        </Box>
      </VStack>
    </Box>
  );
};

export default StatsPanel;
