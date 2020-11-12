function handleMembershipPage($) {

    console.log('Running handleMembershipPage()');

    var stripe = Stripe('pk_live_51Hdye3KZR9nDGYgsq1hcFQtKBdlsOZN2PQtXwkYGj0Ng4g3wDpJ8mEKH1xsmDC1FxUbGPgTloqLcG7E8WWtg92SR00tCV2q23g');

    $('#membership-form').on('submit', function(event) {

        event.preventDefault();

        var requestBody = {
            payment: {
                frequency: 'recurring',
                product: 'prod_IMhoqk3abIHKhu',
                amount: $(this.amount).val(),
                currency: $(this.currency).val(),
                interval: $(this.interval).val(),
            },
            checkout: {
                cancel_url: $(this.cancel_url).val(),
                success_url: $(this.success_url).val(),
            },
            customer: {
                name: $(this.first_name).val() + ' ' + $(this.last_name).val(),
                email: $(this.email).val(),
                address: {
                    line1: $(this.address_line_1).val(),
                    line2: $(this.address_line_2).val(),
                    city: $(this.city).val(),
                    postal_code: $(this.postal_code).val(),
                }
            },
            meta: {}
        };
        
        $.ajax({
            url: "https://stripe-donation-worker.theideabureau.co/api/checkout/coSANnEP5sk2ONLJ",
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
