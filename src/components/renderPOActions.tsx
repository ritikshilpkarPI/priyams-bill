import { Box, Button } from '@mantine/core';

const renderPurchaseOrderActions = ({
  list,
  index,
  isAdminUser,
  isApprovedPO,
  isSavedApprovedPage,
  loadingState,
  draftOrder,
  approveOrder,
  rejectOrder,
  navigate,
}: RenderActionsProps) => {
  const loading = loadingState[list._id];

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 12,
        height: '100%',
        width: '100%',
      }}
    >
      {isAdminUser ? (
        <>
          {list.isApproved ? (
            <Button
              onClick={() =>
                navigate(`/new-purchase-order/${list._id}`, {
                  state: { isApprovedPO: true, id: list._id },
                })
              }
            >
              Details
            </Button>
          ) : (
            <Button
              variant="light"
              onClick={() =>
                navigate(`/new-purchase-order/${list._id}`, {
                  state: { isEditedByAdmin: true, id: list._id },
                })
              }
            >
              Edit
            </Button>
          )}

          {!(list.isDraft &&isSavedApprovedPage) && !isApprovedPO &&
            <Button
              disabled={!!loading || list.isRejected || list.isApproved}
              loading={!!loading?.state && loading.btnName === 'draft'}
              onClick={() => draftOrder(list._id, index)}
              className="approve-btn"
            >
              Draft
            </Button>
          }
        </>
      ) : (
        <>
          <Button
            variant="light"
            onClick={() =>
              navigate(`/purchase/${list._id}`, {
                state: { isEditedByAdmin: true, id: list._id },
              })
            }
          >
            Edit
          </Button>
          {!isApprovedPO && (
            <Button
              disabled={!!loading || list.isRejected}
              loading={!!loading?.state && loading.btnName === 'draft'}
              onClick={() => draftOrder(list._id, index)}
              className="approve-btn"
            >
              Draft
            </Button>
          )}
        </>
      )}
    </Box>
  );
};
export default renderPurchaseOrderActions;
