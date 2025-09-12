import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  Spinner,
  useToast,
  Text,
} from '@chakra-ui/react';
import { getMedicationRequests, approveRequest, rejectRequest } from '../../utils/api';

type Req = {
  id: number;
  naziv: string;
  DjelatnaTvar : string;
};

const RequestsPanel: React.FC = () => {
  const [requests, setRequests] = useState<Req[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const toast = useToast();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getMedicationRequests();
        if (!mounted) return;
        setRequests(data || []);
      } catch (e: any) {
        toast({ title: 'Failed to load requests', status: 'error' });
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (loading) return <Spinner />;

  if (requests.length === 0) return <Text>Trenutno nema zahtjeva.</Text>;

  return (
    <Box>
      <Heading as="h3" size="md" mb={3}>Zahtjevi za lijekovima</Heading>
      <TableContainer>
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>Naziv</Th>
              <Th>Djelatna Tvar</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {requests.map(r => (
              <Tr key={r.id}>
                <Td>{r.naziv}</Td>
                <Td>{r.DjelatnaTvar}</Td>
                <Td>
                  <Button
                    size="sm"
                    mr={2}
                    isLoading={processingId === r.id}
                    onClick={async () => {
                      try {
                        setProcessingId(r.id);
                        await approveRequest(r.id);
                        setRequests(reqs => reqs.filter(x => x.id !== r.id));
                        toast({ title: 'Approved', status: 'success' });
                      } catch (e: any) {
                        toast({ title: 'Approve failed', description: e?.message, status: 'error' });
                      } finally {
                        setProcessingId(null);
                      }
                    }}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="red"
                    isLoading={processingId === r.id}
                    onClick={async () => {
                      try {
                        setProcessingId(r.id);
                        await rejectRequest(r.id);
                        setRequests(reqs => reqs.filter(x => x.id !== r.id));
                        toast({ title: 'Rejected', status: 'info' });
                      } catch (e: any) {
                        toast({ title: 'Reject failed', description: e?.message, status: 'error' });
                      } finally {
                        setProcessingId(null);
                      }
                    }}
                  >
                    Reject
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default RequestsPanel;
