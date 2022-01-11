import { gql, useMutation, useSubscription } from "@apollo/client";
import {
  EmptyState,
  ResourceItem,
  ResourceList,
  TextStyle,
  Thumbnail,
} from "@shopify/polaris";
import { useState } from "react";

const Pending = () => {
  const { loading, data } = useSubscription(gql`
    subscription {
      requests(where: { status: { _eq: "pending" } }) {
        id
        product_id
        product_images
        product_title
        product_handle
      }
    }
  `);
  const [cancel, { loading: canceling }] = useMutation(gql`
    mutation($ids: [uuid!]) {
      delete_requests(where: { id: { _in: $ids } }) {
        returning {
          id
        }
      }
    }
  `);
  const [selectedItems, setSelectedItems] = useState([]);

  const items = data?.requests || [];
  const promotedBulkActions = [
    {
      content: "Cancel requests",
      onAction: () =>
        cancel({
          variables: {
            ids: selectedItems,
          },
        }),
    },
  ];
  const emptyStateMarkup = !items.length ? (
    <EmptyState
      heading="No pending requests"
      image="/assets/emptystate.svg"
      footerContent="Pending requests are requests that haven't been sent to the workers yet."
      fullWidth={true}
    ></EmptyState>
  ) : undefined;

  function renderItem(item) {
    const shortcutActions = [
      {
        content: "Cancel request",
        onClick: () =>
          cancel({
            variables: {
              ids: [item.id],
            },
          }),
        loading: canceling,
      },
    ];

    return (
      <ResourceItem
        id={item.id}
        media={
          <Thumbnail
            source={
              item.product_images[0] ||
              "https://cdn.shopify.com/s/images/admin/no-image-large.gif"
            }
            alt={item.product_title}
          />
        }
        shortcutActions={shortcutActions}
        onClick={() => {}}
        verticalAlignment="center"
      >
        <h3>
          <TextStyle variation="strong">{item.product_title}</TextStyle>
        </h3>
        <div>{item.product_handle}</div>
      </ResourceItem>
    );
  }

  return (
    <ResourceList
      items={items}
      renderItem={renderItem}
      selectedItems={selectedItems}
      onSelectionChange={setSelectedItems as any}
      selectable
      promotedBulkActions={promotedBulkActions}
      emptyState={emptyStateMarkup}
      loading={loading}
    />
  );
};

export default Pending;
