function handleDonatePage($) {

    console.log('Running handleDonatePage()');
    
    var stripe = Stripe('pk_live_51HdyBKDhz7tkkLlhA2nImoUTUhTMcmf33GnhNzmIV1ThIhvfUkXADZKjSZvxPES8PTmHAEDflThXLxE6oAufCiXc00jbhGEDPH');

    var urlParams = new URLSearchParams(window.location.search);
    var $strapline = $('#donation-strapline');

    // prepare all of the static request values
    var requestBody = {};

    // ensure we have the correct query string and update the strapline
    if (urlParams.has('single')) {

        requestBody.frequency = 'single';
        requestBody.amount = parseFloat(urlParams.get('single'));
        requestBody.product = 'prod_IHjys2JljYyzqm';

        $strapline.html('Single donation amount: £' + urlParams.get('single'));

    } else if (urlParams.has('monthly')) {

        requestBody.frequency = 'recurring';
        requestBody.amount = parseFloat(urlParams.get('monthly'));
        requestBody.product = 'prod_IHjyGAp5Mcvw8s';

        $strapline.html('Monthly donation amount: £' + urlParams.get('monthly'));

    } else {

        // if neither single or monthly values are set, forward back to the donate page
        window.location.href = '/donate';

    }
  
    $('#donate-form').on('submit', function(event) {

        event.preventDefault();
        
        // increase the amount if the user has opted to cover the fees
        if ($(this.cover_fees).prop('checked')) {
            requestBody.amount += 0.50;
        }
        
        requestBody.currency = $(this.currency).val();
        requestBody.interval = $(this.interval).val();
        requestBody.cancel_url = $(this.cancel_url).val();
        requestBody.success_url = $(this.success_url).val();
        requestBody.first_name = $(this.first_name).val();
        requestBody.last_name = $(this.last_name).val();
        requestBody.email = $(this.email).val();
        requestBody.gift_aid = $(this.gift_aid).prop('checked');

        $.ajax({
            url: "https://stripe-donation-worker.theideabureau.co/api/checkout/MO7A6p5qrFfSkbXo",
            method: 'POST',
            data: requestBody,
            accepts: {
                text: "application/json"
            }
        })
        .done(function( data ) {

            stripe.redirectToCheckout({
                sessionId: data.session_id
            }).then((result) => {
                alert("There was an error directing you to the payment, please refresh and try again.");
            });

        });

    });

}
