import express from 'express'
import fs from 'fs'
import path from 'path'


const app = express();
const PORT = 3000;

const folderPath = path.resolve(process.cwd(), 'timestamps');

// Endpoint to create a text file with the current timestamp
app.get('/create-timestamp-file', (req, res) => {
    const now = new Date();
    const timestamp = now.toISOString();
    const filename = `${now.toISOString().replace(/[:.]/g, '-')}.txt`;

    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
    }

    const filePath = path.join(folderPath, filename);

    fs.writeFile(filePath, timestamp, (err) => {
        if (err) {
            console.error('Error writing file:', err);
            res.status(500).send('Failed to create file');
        } else {
            console.log('File created successfully:', filePath);
            res.send(`File created successfully: ${filePath}`);
        }
    });
});

// Endpoint to retrieve all text files in the 'timestamps' folder
app.get('/list-timestamp-files', (req, res) => {
    if (!fs.existsSync(folderPath)) {
        return res.status(404).send('Folder does not exist');
    }

    fs.readdir(folderPath, (err, files) => {
        if (err) {
            console.error('Error reading folder:', err);
            res.status(500).send('Failed to read folder');
        } else {
            const txtFiles = files.filter(file => path.extname(file) === '.txt');
            res.json(txtFiles);
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});