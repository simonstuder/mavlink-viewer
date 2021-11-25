# mavlink-viewer

This tool is in development and can be run with 
`npm start`

## Features
There is an orientation viewer which visualized the ATTITUDE_QUATERNION messages of one system that can be selected

A MessageViewer displays all the received messages from all systems and components. They are all put into collapsable buttons per systems and components. 
Additionally, all messages from components from one system are displayed under this system id as well.

A MessageInjector lists all available Mavlink messages and by clicking on one of them all their fields. After modifying the values a click on the send button will emit this message with the given values.
