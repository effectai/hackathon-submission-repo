import { gql, useLazyQuery, useSubscription } from "@apollo/client";
import { ResourcePicker, useAppBridge } from "@shopify/app-bridge-react";
import { authenticatedFetch } from "@shopify/app-bridge-utils";
import {
  Badge,
  Banner,
  Button,
  Card,
  Heading,
  Modal,
  Page,
  RangeSlider,
  SkeletonBodyText,
  SkeletonDisplayText,
  Tabs,
  TextContainer,
} from "@shopify/polaris";
import { useCallback, useEffect, useState } from "react";
import { Redirect } from "@shopify/app-bridge/actions";
import { useRouter } from "next/dist/client/router";
import Pending from "../components/Pending";
import InProgress from "../components/InProgress";
import Results from "../components/Results";
import Done from "../components/Done";

const Index = () => {
  const { loading, error, data } = useSubscription(gql`
    subscription {
      credits_aggregate {
        aggregate {
          sum {
            amount
          }
        }
      }
    }
  `);
  const { data: statuses } = useSubscription(gql`
    subscription {
      requests_status {
        status
        count
      }
    }
  `);
  const [
    checkExistence,
    { loading: checkingExistence, data: existing },
  ] = useLazyQuery(gql`
    query($ids: [bigint!]) {
      requests(where: { product_id: { _in: $ids } }) {
        product_id
      }
    }
  `);
  const app = useAppBridge();
  const { query } = useRouter();
  const [selected, setSelected] = useState(0);
  const [active, setActive] = useState(false);
  const [pick, setPick] = useState(false);
  const [amount, setAmount] = useState(20);
  const [confirm, setConfirm] = useState(false);
  const [fetchingLink, setFetchingLink] = useState(false);
  const [ids, setIds] = useState<number[]>([]);
  const [sent, setSent] = useState(0);

  const toggleAddCredits = useCallback(() => setActive(!active), [active]);
  const toggleConfirm = useCallback(() => setConfirm(!confirm), [confirm]);
  const handleAmountChange = useCallback((value) => setAmount(value), []);
  const handleTabChange = useCallback((index) => setSelected(index), []);

  useEffect(() => {
    if (!query["ids[]"]?.length) return;
    let ids = query["ids[]"];
    if (!Array.isArray(ids)) ids = [ids];
    setIds(ids.map((id) => parseInt(id)));
  }, [query]);

  useEffect(() => {
    if (ids.length) {
      setSent(0);
      checkExistence({
        variables: {
          ids,
        },
      });
      setConfirm(true);
    }
  }, [ids]);

  const addCredits = () => {
    setFetchingLink(true);
    authenticatedFetch(app)(`/credits/add?quantity=${amount}`).then(
      async (res) => {
        const redirect = Redirect.create(app);
        redirect.dispatch(Redirect.Action.REMOTE, {
          url: (await res.json()).confirmation_url,
          newContext: true,
        });
        setFetchingLink(false);
        setActive(false);
      }
    );
  };

  const sendRequests = async () => {
    toggleConfirm();
    setSent(0);
    let sent = 1;
    for (const id of queue) {
      setSent(sent++);
      await authenticatedFetch(app)(`/requests/new?id=${id}`);
    }
    setIds([]);
  };

  const tabs = [
    {
      id: "pending",
      content: (
        <span>
          Pending{" "}
          <Badge status="new">
            {statuses?.requests_status?.find((r) => r.status === "pending")
              ?.count || 0}
          </Badge>
        </span>
      ),
      component: Pending,
    },
    {
      id: "in_progress",
      content: (
        <span>
          In progress{" "}
          <Badge status="new">
            {statuses?.requests_status?.find((r) => r.status === "in_progress")
              ?.count || 0}
          </Badge>
        </span>
      ),
      component: InProgress,
    },
    {
      id: "results",
      content: (
        <span>
          Results{" "}
          <Badge status="new">
            {statuses?.requests_status?.find((r) => r.status === "under_review")
              ?.count || 0}
          </Badge>
        </span>
      ),
      component: Results,
    },
    {
      id: "done",
      content: (
        <span>
          Done{" "}
          <Badge status="new">
            {statuses?.requests_status?.find((r) => r.status === "done")
              ?.count || 0}
          </Badge>
        </span>
      ),
      component: Done,
    },
  ];
  const queue = ids.filter(
    (id) => !existing?.requests?.find((r) => r.product_id === id)
  );
  const credits = data?.credits_aggregate.aggregate.sum.amount || 0;
  const Component: any = tabs[selected].component;

  return (
    <Page
      title="Recategorization requests"
      primaryAction={
        <Button onClick={() => setPick(true)} primary>
          New request
        </Button>
      }
    >
      {loading || error ? (
        <Card sectioned>
          <TextContainer>
            <SkeletonDisplayText size="small" />
            <SkeletonBodyText lines={2} />
          </TextContainer>
        </Card>
      ) : (
        <Card
          title={`You have ${credits} credits`}
          actions={[{ content: "Add credits", onAction: toggleAddCredits }]}
          sectioned
        >
          <p>
            Each credit allows you to request recategorization for 1 product,
            add credits to send more requests.
          </p>
        </Card>
      )}

      {sent > 0 && queue.length > 0 && (
        <Card>
          <Banner
            title={`Sent ${sent} out of ${queue.length} requests`}
            status="warning"
          >
            <p>
              Please don't close this page while we send your requests. It may
              take several minutes.
            </p>
          </Banner>
        </Card>
      )}

      {sent > 0 && queue.length === 0 && (
        <Card>
          <Banner status="success">
            <p>
              We have sent {sent} requests! You can use this page to track their
              status.
            </p>
          </Banner>
        </Card>
      )}

      <Card>
        <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
          <Component setIds={setIds} />
        </Tabs>
      </Card>
      <Modal
        open={active}
        onClose={toggleAddCredits}
        title="Purchase credits"
        primaryAction={{
          content: `Get ${amount} credits - $${amount / 20}`,
          onAction: addCredits,
          loading: fetchingLink,
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: toggleAddCredits,
          },
        ]}
      >
        <Modal.Section>
          <RangeSlider
            output
            label="Credits to add"
            min={20}
            max={1000}
            step={20}
            value={amount}
            onChange={handleAmountChange}
          />
        </Modal.Section>
      </Modal>
      <Modal
        open={confirm}
        onClose={toggleConfirm}
        title="Confirm request"
        primaryAction={{
          content: `Confirm`,
          onAction: sendRequests,
          loading: checkingExistence || loading,
          disabled: queue.length < 1 || credits < queue.length,
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: toggleConfirm,
          },
        ]}
      >
        {confirm && (
          <Modal.Section>
            {checkingExistence || loading ? (
              <SkeletonBodyText />
            ) : (
              <>
                {existing.requests.length ? (
                  <>
                    <Banner
                      title={`You have already requested recategorization for ${existing.requests.length} of the products you selected.`}
                      status="warning"
                    ></Banner>
                    <br />
                  </>
                ) : null}
                <TextContainer>
                  <Heading>Recategorizing {queue.length} products</Heading>
                  <p>
                    That would cost you {queue.length} credits. You currently
                    have {credits} credits in your account.
                  </p>
                </TextContainer>
              </>
            )}
          </Modal.Section>
        )}
      </Modal>
      <ResourcePicker
        resourceType="Product"
        showVariants={false}
        showArchived={false}
        open={pick}
        onSelection={(resources) => {
          setIds(
            resources.selection.map((p) => parseInt(p.id.split("/").pop()))
          );
          setPick(false);
        }}
        onCancel={() => setPick(false)}
      />
    </Page>
  );
};

export default Index;
