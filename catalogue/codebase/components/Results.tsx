import { gql, useMutation, useSubscription } from "@apollo/client";
import { useAppBridge } from "@shopify/app-bridge-react";
import { authenticatedFetch } from "@shopify/app-bridge-utils";
import {
  EmptyState,
  Layout,
  ResourceItem,
  ResourceList,
  Subheading,
  TextStyle,
  Thumbnail,
} from "@shopify/polaris";
import { useState } from "react";

const Results = ({ setIds }) => {
  const app = useAppBridge();
  const { loading, data } = useSubscription(gql`
    subscription {
      requests(where: { status: { _eq: "under_review" } }) {
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
  const [applying, setApplying] = useState(false);

  const items = data?.requests || [];
  const promotedBulkActions = [
    {
      content: "Re-request",
      onAction: () =>
        cancel({
          variables: {
            ids: selectedItems,
          },
        }).then(() =>
          setIds(
            items
              .filter(({ id }) => selectedItems.includes(id))
              .map(({ product_id }) => product_id)
          )
        ),
    },
    {
      content: "Apply changes",
      onAction: () =>
        apply(items.filter(({ id }) => selectedItems.includes(id))),
    },
  ];
  const emptyStateMarkup = !items.length ? (
    <EmptyState
      heading="No results yet"
      image="/assets/emptystate.svg"
      footerContent="This is where you will find the categories submitted by the workers."
      fullWidth={true}
    ></EmptyState>
  ) : undefined;

  const apply = (items) => {
    setApplying(true);
    authenticatedFetch(app)(`/requests/apply`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requests: items.map((item) => ({
          id: item.id,
          product_id: item.product_id,
          results: item.results,
        })),
      }),
    }).then(() => {
      setApplying(false);
    });
  };

  function renderItem(item) {
    const shortcutActions = [
      {
        content: "Re-request",
        onClick: () =>
          cancel({
            variables: {
              ids: [item.id],
            },
          }).then(() => setIds([item.product_id])),
        loading: canceling,
      },
      {
        content: "Apply changes",
        onClick: () => apply([item]),
        loading: applying,
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
        <Layout>
          <Layout.Section oneThird>
            <h3>
              <TextStyle variation="strong">{item.product_title}</TextStyle>
            </h3>
            <div>{item.product_handle}</div>
          </Layout.Section>
          <Layout.Section oneThird>
            <Subheading>Current categories</Subheading>
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
      selectedItems={selectedItems}
      onSelectionChange={setSelectedItems as any}
      selectable
      promotedBulkActions={promotedBulkActions}
      emptyState={emptyStateMarkup}
      loading={loading}
    />
  );
};

export default Results;
