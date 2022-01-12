import { gql, useSubscription } from "@apollo/client";
import {
  EmptyState,
  Layout,
  ResourceItem,
  ResourceList,
  Subheading,
  TextStyle,
  Thumbnail,
} from "@shopify/polaris";

const Done = () => {
  const { loading, data } = useSubscription(gql`
    subscription {
      requests(where: { status: { _eq: "done" } }) {
        id
        product_id
        product_images
        product_title
        product_collections
        product_handle
        results
      }
    }
  `);

  const items = data?.requests || [];
  const emptyStateMarkup = !items.length ? (
    <EmptyState
      heading="No approved requests"
      image="/assets/emptystate.svg"
      footerContent="You will find your requests here once you review and approve the submissions."
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
        <Layout>
          <Layout.Section oneThird>
            <h3>
              <TextStyle variation="strong">{item.product_title}</TextStyle>
            </h3>
            <div>{item.product_handle}</div>
          </Layout.Section>
          <Layout.Section oneThird>
            <Subheading>Previous categories</Subheading>
            <p>
              {item.product_collections
                .map((collection) => collection.title)
                .join(", ") || "None"}
            </p>
          </Layout.Section>
          <Layout.Section oneThird>
            <Subheading>Submitted categories</Subheading>
            <p>
              {item.results.map((collection) => collection.title).join(", ")}
            </p>
          </Layout.Section>
        </Layout>
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

export default Done;
