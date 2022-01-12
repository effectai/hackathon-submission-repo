module.exports.createCampaign = async function createCampaign(client) {
  const uploadCampaignIpfs = {
    // The title of the campaign
    title: "Help us make internet informative and productive.",

    // Description of the campaign
    description: "Help us curb Rumors, Fake News, Hoax & Misinformation by identifying the below as Authentic. The details shown are associated with events, incidents and governement facilities in and around your local area.",

    // Instructions for workers on how to complete tasks, accepts Markdown
    instructions: "Help us curb Rumors, Fake News, Hoax & Misinformation by identifying the below as Authentic. The details shown are associated with events, incidents and governement facilities in and around your local area. Choose whether the details (image, description) about event/incident are Authentic. Also provide us with any other info in the text box. Thanks.",

    // The template that will be used for the tasks
    template: `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="robots" content="noindex, nofollow" />
        <title></title>
        <link
          href="https://cdn.quilljs.com/1.3.6/quill.snow.css"
          rel="stylesheet"
        />
    
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
          crossorigin="anonymous"
        />
        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"
          crossorigin="anonymous"
        ></script>
        <script src="https://cdn.quilljs.com/1.3.6/quill.js"></script>
        <script>
          setTimeout(() => window.forceResize(), 1000);
        </script>
      </head>
    
      <body>
        <div class="m-3 p-3 mb-0 pb-0">
          <h1 class="h1">Authentic</h1>
          <h3 class="h3">For the people, by the people.</h3>
        </div>
        <div class="card m-3 p-2" style="max-width: 45rem">
          <img
            class="card-img-top"
            style="width: auto; max-height: 500px"
            alt="` + "${title}" +`"
            src="` + "${image}" + `"
          />
          <div class="card-body">
            <div class="container overflow-hidden">
              <h4 class="h4">
                Help us curb Rumors, Fake News, Hoax & Misinformation by identifying
                the below as <b>Authentic</b>.
              </h4>
              <p>
                The details shown are associated with events, incidents and
                governement facilities in and around your desired area.
              </p>
              <form>
                <div class="row">
                  <div class="col-24">
                    <h2 class="card-title">` + "${title}" + `</h2>
                    <p class="card-text">
                      <i>` + "${description}" + `</i>
                    </p>
                  </div>
                </div>
                <div class="row mt-3">
                  <p>
                    Are the details (image, description) about event/incident
                    <b>Authentic</b>?
                  </p>
                  <div class="col-3">
                    <input
                      type="radio"
                      class="btn-check"
                      name="authentic"
                      value="yes"
                      id="success-outlined"
                    />
                    <label class="btn btn-outline-success" for="success-outlined"
                      >Absolutely</label
                    >
                  </div>
                  <div class="col">
                    <input
                      type="radio"
                      class="btn-check"
                      name="authentic"
                      value="no"
                      id="danger-outlined"
                    />
                    <label class="btn btn-outline-danger" for="danger-outlined"
                      >Nope</label
                    >
                  </div>
                </div>
                <div class="row mt-3 mb-5">
                  <div class="col-12">
                    <div id="comment"></div>
                    <input
                      id="comment1"
                      name="comment"
                      hidden
                      data-sample-preservewhitespace
                    />
                  </div>
                </div>
                <div class="row mt-8">
                  <div class="col-12">
                    <input
                      class="btn btn-primary"
                      id="submit1"
                      name="submit"
                      type="submit"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
    
        <script>
          setTimeout(() => window.forceResize(), 1000);
          const ele = document.getElementById("comment1")
          var quill = new Quill("#comment", {
            modules: {
              toolbar: [
                [{ header: [1, 2, false] }],
                ["bold", "italic", "underline"],
                ["image", "h1"],
              ],
            },
            placeholder: "Tell us a secret about this event/incident/facilities.",
            theme: "snow",
          });

          quill.setContents(JSON.parse(ele.value).ops);

          quill.on("text-change", function (delta, oldDelta, source) {
            ele.value = JSON.stringify(quill.getContents())
          });
        </script>
      </body>
    </html>
    `,
    // Campaign image
    image:
      "https://ipfs.effect.ai/ipfs/bafkreiggnttdaxleeii6cdt23i4e24pfcvzyrndf5kzfbqgf3fxjryj5s4",

    // The category of the campaign
    category: "Image labelling",

    // Example task that will prefill the task template
    example_task: {
      title: "",
      description: "",
      image: ""
    },

    // Version of the campaign
    version: 1,

    // Amount of EFX to reward for completinga task
    reward: 1,
  };
  console.log(uploadCampaignIpfs);
  return await client.force.makeCampaign(uploadCampaignIpfs, "0.001");
};
