import { Button, Flex, Modal } from '@mantine/core';

export const QuestionModal = ({
  opened,
  onClose,
  question,
  onAgree,
  onDisagree,
  children,
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
        <Button onClick={onAgree}>Yes</Button>
        <Button onClick={onDisagree}>No</Button>
        </Flex>
      </Flex>
    </Modal>
  );
};
