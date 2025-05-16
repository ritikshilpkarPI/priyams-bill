import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  useMantineTheme,
  Container,
  Card,
  Title,
  Text,
  Loader,
  Table,
  Badge,
  Group,
  Button,
  Divider,
  ScrollArea,
  SimpleGrid,
  Space,
  Timeline,
  Select,
  Stack,
  TextInput,
} from '@mantine/core'
import dayjs from 'dayjs'
import {
  getExpiryItemsBatchByIdAPI,
  markExpiryItemsBatchClearedAPI,
} from 'src/utils/apiUtils'
import { getUser } from 'src/utils/getUser'
import { toast } from 'react-toastify'

interface StatusRecord {
  _id: string
  status: string
  dateTime: string
  browser: string
  os: string
  ipReferrer: string
  statusChangeRemark: string
  staffId: { name: string }
}

interface ItemRecord {
  _id: string
  expiryDate: string
  quantity: number
  costPricePerUnit: number
  totalCostPrice: number
  itemId: { sku: string; itemName: string }
}

interface Batch {
  clearanceDetails: any
  _id: string
  boxId: string
  dealerId: { dealerName: string }
  expiryBatchCost: number
  status: string
  statusHistory: StatusRecord[]
  items: ItemRecord[]
  createdAt: string
  updatedAt: string
}

const AddClearancePage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const theme = useMantineTheme()

  const [batch, setBatch] = useState<Batch | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [clearanceType, setClearanceType] = useState<
    | 'REVERTED_TO_DEALER'
    | 'CLEARED_BY_PURCHASE_ORDER'
    | 'SOLD_ON_OFFER'
    | 'DISPOSED'
  >('REVERTED_TO_DEALER')
  const [note, setNote] = useState('')

  const user = getUser()
  const isCleared = batch?.status === 'CLEARED'

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }
    ;(async () => {
      try {
        const res = await getExpiryItemsBatchByIdAPI(id)
        if (res.success) setBatch(res.data)
        else toast('Failed to load batch. Please try again.', { type: 'error' })
      } catch {
        toast('Error fetching batch. Please try again.', { type: 'error' })
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  const handleSubmit = useCallback(async () => {
    if (!batch || !id || isCleared) return
    if (!clearanceType) {
      toast('Please select a clearance action.', { type: 'error' })
      return
    }
    setSubmitting(true)
    const clearanceDetails: any = { clearanceReason: clearanceType,clearanceRemark: note }
    const browser = navigator.userAgent
    const os = navigator.platform
    const ipReferrer = document.referrer
    const staffId = user?.id || 'unknown-staff'
    const payload = {
      status: clearanceType,
      clearanceDetails,
      statusChangeRemark: note,
      staffId,
      browser,
      os,
      ipReferrer,
    }
    try {
      const res = await markExpiryItemsBatchClearedAPI(id, payload)
      if (res.isError) throw res.error
      toast('Batch cleared successfully.', { type: 'success' })
      setBatch(res.data)
      navigate('/expiry-items-batch')
    } catch {
      toast('Error clearing batch. Please try again.', { type: 'error' })
    } finally {
      setSubmitting(false)
    }
  }, [batch, id, isCleared, clearanceType, note, navigate, user])

  if (loading || !batch)
    return <Loader size="lg" style={{ margin: '100px auto', display: 'block' }} />

  return (
    <ScrollArea style={{ height: '100vh', padding: 24 }}>
      <Container size="xl">
        <Card shadow="lg" radius="md" withBorder p="xl">
          <Group position="apart">
            <Title order={2} color={theme.colors.teal[7]}>
              Add Clearance
            </Title>
            <Button variant="outline" color="gray" onClick={() => navigate(-1)}>
              Cancel
            </Button>
          </Group>

          <Space h="md" />

          <SimpleGrid cols={4} spacing="lg" breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
            {[
              { label: 'Box ID', value: batch.boxId, bg: theme.colors.blue[0] },
              { label: 'Dealer', value: batch.dealerId.dealerName, bg: theme.colors.orange[0] },
              {
                label: 'Batch Cost',
                value: `₹${batch.expiryBatchCost.toFixed(2)}`,
                bg: theme.colors.green[0],
              },
              {
                label: 'Status',
                value: batch.status,
                bg: batch.status === 'SAVED' ? theme.colors.yellow[0] : theme.colors.green[0],
              },
            ].map((info) => (
              <Card key={info.label} p="md" radius="md" sx={{ backgroundColor: info.bg }}>
                <Text size="xs" color="dimmed">
                  {info.label}
                </Text>
                {info.label === 'Status' ? (
                  <Badge size="lg" color={batch.status === 'SAVED' ? 'yellow' : 'green'}>
                    {info.value}
                  </Badge>
                ) : (
                  <Text size="xl" weight={500}>
                    {info.value}
                  </Text>
                )}
              </Card>
            ))}
          </SimpleGrid>

          <Space h="xl" />
          <Divider />

          <Space h="md" />
          <Group spacing="xl">
            <Text size="sm" color="dimmed">
              Created: {dayjs(batch.createdAt).format('DD MMM YYYY HH:mm')}
            </Text>
            <Text size="sm" color="dimmed">
              Updated: {dayjs(batch.updatedAt).format('DD MMM YYYY HH:mm')}
            </Text>
          </Group>

          <Divider my="lg" />

          <Title order={4}>Status History</Title>
          <Card withBorder p="sm" radius="md" mt="sm">
            <Timeline active={batch.statusHistory.length - 1} bulletSize={16} lineWidth={2} color="teal">
              {batch.statusHistory.map((h) => (
                
                <Timeline.Item
                  key={h._id}
                  title={`${h.status} by ${h.staffId.name}`}
                  bullet={<Badge color="teal" size="xs">{dayjs(h.dateTime).format('DD MMM')}</Badge>}
                >
                  <Group spacing="xs" mb="xs">
                    <Text size="xs" color="dimmed">{dayjs(h.dateTime).format('HH:mm')}</Text>
                    <Badge variant="outline" size="xs">OS: {h.os}</Badge>
                    <Badge variant="outline" size="xs">Browser: {h.browser}</Badge>
                  </Group>
                  {h.statusChangeRemark && (
                    <Text size="sm" color="dimmed">Remark: {h.statusChangeRemark}</Text>
                  )}
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>

          <Space h="xl" />
          <Divider />

          <Title order={4}>Expired Items</Title>
          <Card withBorder p="sm" radius="md" mt="sm">
            <ScrollArea>
              <Table verticalSpacing="lg" highlightOnHover>
                <thead>
                  <tr>
                    <th style={{ color: theme.colors.gray[6] }}>Product</th>
                    <th style={{ color: theme.colors.gray[6] }}>Expiry</th>
                    <th style={{ color: theme.colors.gray[6] }}>Qty</th>
                    <th style={{ color: theme.colors.gray[6] }}>Cost/Unit</th>
                    <th style={{ color: theme.colors.gray[6] }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {batch.items.map((it) => (
                    <tr key={it._id}>
                      <td>
                        <Stack spacing={4}>
                          <Text size="xs" color="dimmed">{it.itemId.sku}</Text>
                          <Text size="md" weight={500}>{it.itemId.itemName}</Text>
                        </Stack>
                      </td>
                      <td>
                        <Badge size="lg" color={dayjs(it.expiryDate).isBefore(dayjs()) ? 'red' : 'orange'}>
                          <Text size="lg" weight={600}>{dayjs(it.expiryDate).format('DD MMM YYYY')}</Text>
                        </Badge>
                      </td>
                      <td><Text size="lg" weight={600}>{it.quantity}</Text></td>
                      <td><Text size="lg" weight={600} color={theme.colors.green[7]}>₹{it.costPricePerUnit.toFixed(2)}</Text></td>
                      <td><Text size="lg" weight={600} color={theme.colors.blue[7]}>₹{it.totalCostPrice.toFixed(2)}</Text></td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </ScrollArea>
          </Card>

          <Space h="xl" />
          <Divider />

          <Title order={4}>Clearance Details</Title>
          <Card withBorder p="md" radius="md" mt="sm">
          {!isCleared ? (
              <>
                <Select
                  label="Clearance Action"
                  placeholder="Select action"
                  data={[
                    { value: 'REVERTED_TO_DEALER', label: 'Reverted to dealer' },
                    { value: 'CLEARED_BY_PURCHASE_ORDER', label: 'Cleared by purchase order' },
                    { value: 'SOLD_ON_OFFER', label: 'Sold on offer' },
                    { value: 'DISPOSED', label: 'Disposed' },
                  ]}
                  required
                  value={clearanceType}
                  onChange={(val) => val && setClearanceType(val as any)}
                  disabled={isCleared}
                  mt="md"
                  withinPortal
                />
                <TextInput
                  label="Note / Reason"
                  placeholder="Enter note or reason"
                  value={note}
                  onChange={(e) => setNote(e.currentTarget.value)}
                  mt="md"
                  disabled={isCleared}
                />
                <Group position="right" mt="lg">
                  <Button
                    size="md"
                    radius="md"
                    color="teal"
                    onClick={handleSubmit}
                    loading={submitting}
                    disabled={!clearanceType || isCleared}
                  >
                    Submit Clearance
                  </Button>
                </Group>
              </>
            ) : (
              batch.clearanceDetails && (
                <Stack spacing="sm" mt="md">
                  <Text>
                    <Text component="span" weight={500}>Action:</Text> {batch.clearanceDetails.clearanceReason}
                  </Text>
                  <Text>
                    <Text component="span" weight={500}>Cleared On:</Text> {dayjs(batch.clearanceDetails.clearedOn).format('DD MMM YYYY HH:mm')}
                  </Text>
                  <Text>
                    <Text component="span" weight={500}>Remark:</Text> {batch.clearanceDetails.clearanceRemark}
                  </Text>
                </Stack>
              )
            )}
          </Card>
        </Card>
      </Container>
    </ScrollArea>
  )
}

export default AddClearancePage
