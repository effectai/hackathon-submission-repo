


//Function to show loader
function showLoader() {
    $(".page-loader").fadeIn(300);
}

//Function to hide Loader
function hideLoader() {
    $(".page-loader").fadeOut();
}


/***************************************************************************************************

                                     EFFECT NETWORK Function

****************************************************************************************************/


// Initiate Client 
const client = new effectsdk.EffectClient('jungle');

// Instantiating bsc account.
const account = effectsdk.createAccount('0x3d658ba29fe6d3742b607c306a81a48c954060ac2a22cae83679b94482002686');

// Generate web3 instance from account.
const web3 = effectsdk.createWallet(account);

// Function to create campaign object 
var createCampaign = async function() { 

    // Input validation
    $('input').each(function() {
        if ($(this).val() == '') {
            swal('','Please fill in all the field','warning');
            return false;
        }        
    });

    // Connect your account to the Effect Client.
    const effectAccount  = await client.connectAccount(web3);

    // Create Campain object 
    const campaignToIpfs = {

        // The title of the campaign
        title: $("#title").val(),
        
        // Description of the campaign
        description: $("#description").val(),   

        // Instructions
        instructions: `**Voice Instruction**    

        Say "begin" to start listening to tasks.
        Say "repeat" to repeat the speech.
        Say "positive" to answer a positive.
        Say "negative" to answer a negative.
        Say "neutral" to answer a neutral.
        `,  

        // Campaign image
        image: 'https://raw.githubusercontent.com/jensenlim2481284/effectvoice/master/resources/img/sample.png',  

        // The category of the campaign
        category: 'Effect Voice',   

        // Example task that will prefill the task template
        example_task: {
            'content': 'Honestly Effect network is so powerful and easy to learn. Highly, highly recommend to any developer who like blockchain development for Future-of-Work and wanted to contribute to society. This is my first time develop blockchain app and I managed to build my own template within 1 day with zero blockchain knowledge. It is fun and i really love it!'
        },

        // Version of the campaign
        version: 1,  

        // Amount of EFX to reward for completinga task
        reward: 0,

         // The template that will be used for the tasks
        template: templateContent

    }

    // Publish campaign
    const makeCampaign =  client.force.makeCampaign(campaignToIpfs, 0)
    
    // Update batches
    var task = [];
    $.each($('.task'),function(i,e){
        task.push({"content": $('input', e).val()});
    })
    const content = {
        'tasks': task
    }
    await $(window).delay(5000).promise();

    // Retrieve the campaign that was last created & create batch 
    const campaign = await client.force.getMyLastCampaign();
    const batch = await client.force.createBatch(campaign.id, content, 1)

    // Response 
    swal("Campaign Successfully Created", {
        buttons: {
            cancel: "Ok",
            view: true,
        },
    })
    .then((value) => {
        switch (value) {
            case "view":
                window.location.href = "https://testnet.effect.network/campaigns/" + campaign.id;
                break;
        }
    });   
    hideLoader();

}






/***************************************************************************************************

                                     Campaign Function

****************************************************************************************************/





$(document).ready(function() {
    
    // Hide loader 
    hideLoader();

});

// On create campaign
$("#create").click(function(){
    showLoader();
    createCampaign();    
})

// On create task
$(document).on('click','#addTask', function(){
    $("#taskList").append(`
         <div class='task'>
            <div class='d-flex justify-content-between'>
                <label> Task Content </label>
                <button class='btn btn-link delete-task'>  <i class='ti ti-trash'></i> </button>           
            </div>
            <input type='text' class='form-control' name='content'/>
        </div>
    `);
})


// On delete task
$(document).on('click','.delete-task', function(){
    if($('.task').length<=1){
        swal('', 'At least one task', 'warning');
    }
    else{
        $(this).parent().parent().remove();
    }
})


