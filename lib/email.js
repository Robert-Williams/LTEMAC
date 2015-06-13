var mandrill = require('mandrill-api');
function sendEmail(text, subject, to, from)
    mandrill_client = new mandrill.Mandrill('YOUR_API_KEY');
    var message = {
        "html": "<p>" + text + "</p>",
        "text": text,
        "subject": subject,
        "from_email": from,
        "from_name": null,
        "to": [{
                "email": to,
                "name": null,
                "type": "to"
            }],
        "headers": {
            "Reply-To": "message.reply@example.com"
        },
        "important": false,
        "track_opens": null,
        "track_clicks": null,
        "auto_text": null,
        "auto_html": null,
        "inline_css": null,
        "url_strip_qs": null,
        "preserve_recipients": null,
        "view_content_link": null,
        "bcc_address": "message.bcc_address@example.com",
        "tracking_domain": null,
        "signing_domain": null,
        "return_path_domain": null,
        "merge": true,
        "merge_language": "mailchimp",
        "tags": [
            "Test"
        ]
    };
    var async = false;
    var ip_pool = "Main Pool";
    var send_at = "example send_at";
    mandrill_client.messages.send({"message": message, "async": async, "ip_pool": ip_pool, "send_at": send_at}, function(result) {
        console.log(result);
    }, function(e) {
        // Mandrill returns the error as an object with name and message keys
        console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
        // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
    });
}
export.sendEmail = sendEmail;