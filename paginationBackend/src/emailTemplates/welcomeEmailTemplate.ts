const welcomeEmailTemplate = (firstName:string, lastName:string) => {
    const fullName:string=firstName+" "+lastName
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Our Community</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: auto;
            background: white;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
        }
        p {
            color: #555;
            line-height: 1.5;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #aaa;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to Our Family, ${fullName}!</h1>
        <p>Thank you for joining our community! We are thrilled to have you with us.</p>
        <p>We hope you have a great time here and enjoy all the fun activities we have to offer.</p>
        <p>If you have any questions or need assistance, feel free to reach out to us anytime!</p>
        
        <div class="footer">
            <p>Best Regards,<br>Vyas Himachali Company Limited</p>
        </div>
    </div>
</body>
</html>
`;
};
export default welcomeEmailTemplate;