function handleDonatePage($) {

    console.log('Running handleDonatePage(), Swiss');
    
    var stripe = Stripe('pk_live_51Hdye3KZR9nDGYgsq1hcFQtKBdlsOZN2PQtXwkYGj0Ng4g3wDpJ8mEKH1xsmDC1FxUbGPgTloqLcG7E8WWtg92SR00tCV2q23g');

    var urlParams = new URLSearchParams(window.location.search);
    var $strapline = $('#donation-strapline');

    // prepare all of the static request values
    var requestBody = {
        payment: {},
        checkout: {},
        customer: {},
        meta: {}
    };

    // ensure we have the correct query string and update the strapline
    if (urlParams.has('single')) {

        requestBody.payment.frequency = 'single';
        requestBody.payment.amount = parseFloat(urlParams.get('single'));
        requestBody.payment.product = 'prod_IHkAwfMUX0Eq30';

        $strapline.html('Single donation amount: CHF' + urlParams.get('single'));

    } else if (urlParams.has('monthly')) {

        requestBody.payment.frequency = 'recurring';
        requestBody.payment.amount = parseFloat(urlParams.get('monthly'));
        requestBody.payment.product = 'prod_IHk9LXGK9S4W2T';

        $strapline.html('Monthly donation amount: CHF' + urlParams.get('monthly'));

    } else {

        // if neither single or monthly values are set, forward back to the donate page
        window.location.href = '/swiss-friends-of-sethule/make-a-donation';

    }
  
    $('#donate-form').on('submit', function(event) {

        event.preventDefault();
        
        // increase the amount if the user has opted to cover the fees
        if ($(this.cover_fees).prop('checked')) {
            requestBody.payment.amount += 0.50;
        }
        
        requestBody.payment.currency = $(this.currency).val();
        requestBody.payment.interval = $(this.interval).val();
        requestBody.checkout.cancel_url = $(this.cancel_url).val();
        requestBody.checkout.success_url = $(this.success_url).val();
        requestBody.customer.name = $(this.first_name).val() + ' ' + $(this.last_name).val();
        requestBody.customer.email = $(this.email).val();
        requestBody.meta.gift_aid = $(this.gift_aid).prop('checked');

        $.ajax({
            url: "https://stripe-donation-worker.theideabureau.co/api/checkout/kLWxtz2ZTckjhQUX",
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
