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

          {list.isDraft && isSavedApprovedPage ? (
            <Button
              disabled={!!loading || list.isRejected || list.isApproved}
              loading={!!loading?.state && loading.btnName === 'approve'}
              onClick={() => approveOrder(list._id, index, list)}
              className="approve-btn"
            >
              Approve
            </Button>
          ) : (
            !isApprovedPO && (
              <Button
                disabled={!!loading || list.isRejected || list.isApproved}
                loading={!!loading?.state && loading.btnName === 'draft'}
                onClick={() => draftOrder(list._id, index)}
                className="approve-btn"
              >
                Draft
              </Button>
            )
          )}

          {isSavedApprovedPage && (
            <Button
              disabled={
                !!loading || list.isApproved || list.isRejected || !list.isDraft
              }
              loading={!!loading?.state && loading.btnName === 'reject'}
              onClick={() => rejectOrder(list._id, index)}
              className="reject-btn"
            >
              Reject
            </Button>
          )}
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

      {isAdminUser && list.isDraft && (
        <Button
          variant="outline"
          onClick={() => navigate(`/sellDetailsPage/${list._id}`)}
        >
          Sell Details
        </Button>
      )}
    </Box>
  );
};
export default renderPurchaseOrderActions;
