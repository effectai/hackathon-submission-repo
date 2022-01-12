<script>
	let client;
	let submitted = false;
	async function loadForce() {
		client = new effectsdk.EffectClient("jungle");
		const burnerAccount = effectsdk.createAccount(
			"0x65e6b6b5aab5375c498bfb3097461db32bae76fca907806ea86f30b7a1908b86"
		);
		const burnerWallet = effectsdk.createWallet(burnerAccount);
		const connectReponse = await client.connectAccount(burnerWallet);
		console.log(connectReponse);
	}
	async function submitQuestion() {
		submitted = true;
		answer = null;
		try {
			const campaign = await client.force.getCampaign(178);
			console.log("campaign", campaign);
			const content = { tasks: [{ question }] };
			console.log("making batch with tasks", content);
			const batchResponse = await client.force.createBatch(
				campaign.id,
				content,
				1
			);
			waitForResult(batchResponse.leaves[0].substring(2));
		} catch (e) {
			alert(`Something went wrong: ${e.message}`);
			submitted = false;
		}
	}
	async function waitForResult(leafHash) {
		const result = await client.force.getTaskResult(leafHash);
		console.log("result", result);
		if (!result) {
			console.log("result not found, try again in 5s");
			setTimeout(() => {
				waitForResult(leafHash);
			}, 5000);
		} else {
			answer = JSON.parse(result.data).answer;
		}
	}
	let answer;
	let question = "Can you tell me a joke?";
	loadForce();
</script>

<main>
	<img src="/img/logo_animated.svg" alt="Logo Ask a Stranger" />
	<h1>Ask a Stranger</h1>
	<h3>On Effect Force</h3>
	{#if !submitted}
		<textarea bind:value={question} />

		<div>
			<button
				class="button-5"
				disabled={question === "" || (submitted && !answer)}
				on:click={submitQuestion}
				type="submit">Ask Question</button
			>
		</div>
	{/if}
	{#if submitted}
		<p>Question</p>
		<h3>{question}</h3>
		{#if answer}
			<p>{answer}</p>
		{:else}
			<p>- waiting for answer -</p>
		{/if}
	{/if}
</main>

<style lang="scss">
	textarea {
		width: 380px;
		max-width: 100%;
		margin-top: 20px;
		height: 80px;
	}
	main {
		text-align: center;
		padding: 1em;
		margin: 0 auto;
		max-width: 500px;
		width: 100%;
	}

	h1 {
		color: #fa6400;
		font-size: 4em;
		font-weight: 400;
		margin: 0;
	}
	h3 {
		margin: 0;
	}

	/* CSS */
	.button-5 {
		align-items: center;
		background-clip: padding-box;
		background-color: #fa6400;
		border: 1px solid transparent;
		border-radius: 0.25rem;
		box-shadow: rgba(0, 0, 0, 0.02) 0 1px 3px 0;
		box-sizing: border-box;
		color: #fff;
		cursor: pointer;
		font-size: 16px;
		font-weight: 600;
		justify-content: center;
		line-height: 1.25;
		margin: 0;
		min-height: 3rem;
		padding: calc(0.875rem - 1px) calc(1.5rem - 1px);
		position: relative;
		text-decoration: none;
		transition: all 250ms;
		user-select: none;
		-webkit-user-select: none;
		touch-action: manipulation;
		vertical-align: baseline;
		width: auto;
		&:hover {
			transform: translateY(-1px);
			background-color: #fb8332;
			box-shadow: rgba(0, 0, 0, 0.1) 0 4px 12px;
		}
		&:active {
			background-color: #c85000;
			box-shadow: rgba(0, 0, 0, 0.06) 0 2px 4px;
			transform: translateY(0);
		}
		&:disabled {
			background-color: grey;
			transform: translateY(0px);
		}
	}
</style>
