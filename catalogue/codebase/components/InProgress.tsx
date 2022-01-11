import { gql, useSubscription } from "@apollo/client";
import {
  EmptyState,
  ResourceItem,
  ResourceList,
  TextStyle,
  Thumbnail,
} from "@shopify/polaris";

const InProgress = () => {
  const { loading, data } = useSubscription(gql`
    subscription {
      requests(where: { status: { _eq: "in_progress" } }) {
        id
        product_id
        product_images
        product_title
        product_handle
      }
    }
  `);

  const items = data?.requests || [];
  const emptyStateMarkup = !items.length ? (
    <EmptyState
      heading="No requests in progress"
      image="/assets/emptystate.svg"
      footerContent="Requests in progress are requests that are being worked on by the workers."
      fullWidth={true}
    ></EmptyState>
  ) : undefined;

  function renderItem(item) {
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
      emptyState={emptyStateMarkup}
      loading={loading}
    />
  );
};

export default InProgress;
