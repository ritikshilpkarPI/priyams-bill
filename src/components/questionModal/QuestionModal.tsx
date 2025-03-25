import { Button, Flex, Modal } from '@mantine/core';

export const QuestionModal = ({
  opened,
  onClose,
  question,
  onAgree,
  onDisagree,
  children,
  isChangeCTADisabled
}: QuestionModalProps) => {
  return (
    <Modal
      opened={opened}
      closeOnClickOutside={false}
      onClose={onClose}
      centered
    >
      <Flex direction="column" gap="16px" align="center">
        <span>{question}</span>

       {children && <Flex justify="space-between" gap="16px" sx={{ width: '100%' }}>
       
          {children }
        </Flex>}

        <Flex justify="space-between" gap="16px" sx={{ width: '100%' }}>
        <Button disabled={isChangeCTADisabled} onClick={onAgree}>Change</Button>
        <Button onClick={onDisagree}>Cancel</Button>
        </Flex>
      </Flex>
    </Modal>
  );
};
