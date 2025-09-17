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
          <StatLabel>Ukupno korisnika</StatLabel>
          <StatNumber>{stats.total_users}</StatNumber>
        </Stat>
        <Stat p={4} borderWidth={1} borderRadius="md" bg="gray.50">
          <StatLabel>Ukupno lijekova</StatLabel>
          <StatNumber>{stats.total_meds}</StatNumber>
        </Stat>
        <Stat p={4} borderWidth={1} borderRadius="md" bg="gray.50">
          <StatLabel>Poslanih podsjetnika</StatLabel>
          <StatNumber>{stats.sent_reminders}</StatNumber>
        </Stat>
        <Stat p={4} borderWidth={1} borderRadius="md" bg="gray.50">
          <StatLabel>Potvrđenih podsjetnika</StatLabel>
          <StatNumber>{stats.confirmed_reminders}</StatNumber>
        </Stat>
      </SimpleGrid>

      <VStack align="stretch" spacing={4}>
        
        <Box p={4} borderWidth={1} borderRadius="md" bg="white">
          <Heading as="h3" size="md" mb={2}>
            Lijek relative
          </Heading>

          <Box w="100%" display="flex" justifyContent="center">
            {stats.lijek_relative && Object.keys(stats.lijek_relative).length > 0 ? (
              <Box maxW="1000px" w="100%" pt={2}>
                <Box display="grid" gridTemplateColumns="48px 1fr" alignItems="end" minH="220px">
                  <Box position="relative" minW="48px" h="200px" display="flex" flexDirection="column" alignItems="flex-end" justifyContent="flex-end">
                    <Text fontSize="xs" color="gray.700" position="absolute" left={-20} top="35%" transform="rotate(-90deg) translateY(-50%)" whiteSpace="nowrap">Relative (%)</Text>
                    <Box position="absolute" left={41} top={-2} bottom={33} w="2px" bg="gray.400" borderRadius="full" zIndex={1} />
                    <Box position="absolute" left={1} top={-5} h="180px" w="48px" display="flex" flexDirection="column" justifyContent="space-between" zIndex={2}>
                      {[100, 75, 50, 25, 0].map((val, idx) => (
                        <Box key={val} display="flex" alignItems="center" h="36px">
                          <Text fontSize="xs" color="gray.500" w="35px" textAlign="right">{val}%</Text>
                          <Box ml={1} w="8px" h="1px" bg="gray.500" />
                        </Box>
                      ))}
                    </Box>
                  </Box>
                  <Box>
                    <Box display="flex" alignItems="flex-end" h="180px">
                      {Object.entries(stats.lijek_relative).map(([userId, rel]) => {
                        const percent = Math.max(0, Math.min(100, rel * 100));
                        return (
                          <Box key={userId} mx={1} display="flex" flexDirection="column" alignItems="center" w="40px">
                            <Text mb={"2px"} fontSize="xs" color="gray.500">{percent.toFixed(1)}%</Text>
                            <Box
                              aria-label={`Relative bar for user ${userId}`}
                              bgGradient="linear(to-t, teal.400, teal.200)"
                              w="100%"
                              borderRadius="md"
                              transition="height 0.4s"
                              h={`${percent * 1}px`}
                              minH="4px"
                              maxH="160px"
                            />
                          </Box>
                        );
                      })}
                    </Box>
                    <Box mt={2} h="1px" bg="gray.300" w="100%" position="relative" />
                    <Box display="flex" mt={1}>
                      {Object.entries(stats.lijek_relative).map(([userId]) => (
                        <Box key={userId} w="40px" mx={1} textAlign="center">
                          <Text fontSize="xs" color="gray.700" wordBreak="break-all">{userId}</Text>
                        </Box>
                      ))}
                    </Box>
                    <Box mt={1} position="relative" h="16px">
                      <Text position="absolute" left="50%" top="0" transform="translateX(-50%)" fontSize="xs" color="gray.700">Korisnik</Text>
                    </Box>
                  </Box>
                </Box>
              </Box>
            ) : (
              <Text>N/A</Text>
            )}
          </Box>
        </Box>
      </VStack>
    </Box>
  );
};

export default StatsPanel;
