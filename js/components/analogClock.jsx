import React from 'react';
import styles from './styles/analogClock.css';

export default class Clock extends React.Component {

    componentDidMount() {
        const canvas = this.refs.canvas;
        const ctx = canvas.getContext('2d');
        const radius = canvas.height / 2;

        ctx.translate(radius, radius);

        setInterval(() => {
            this.drawClock(ctx, radius);
        }, 1000);
    }

    drawClock(...props) {
        this.drawFace(...props);
        this.drawNumbers(...props);
        this.drawTime(...props);
    }

    drawFace(ctx, radius) {
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, 2 * Math.PI);
        ctx.fillStyle = 'black';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.05, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();
    }

    drawNumbers(ctx, radius) {
        ctx.font = radius * 0.15 + 'px arial';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';

        for (let num = 1; num < 13; num++) {
            const ang = num * Math.PI / 6;
            ctx.rotate(ang);
            ctx.translate(0, - radius * 0.85);
            ctx.rotate(-ang);
            ctx.fillText(num.toString(), 0, 0);
            ctx.rotate(ang);
            ctx.translate(0, radius * 0.85);
            ctx.rotate(-ang);
        }
    }

    drawTime(ctx, radius) {
        const now = new Date();
        let hour = now.getHours();
        let minute = now.getMinutes();
        let second = now.getSeconds();

        // hour
        hour = hour % 12;
        hour = (hour * Math.PI / 6) + (minute * Math.PI / (6 * 60)) + (second * Math.PI / (360 * 60));
        this.drawHand(ctx, hour, radius * 0.5, radius * 0.03);

        // minute
        minute = (minute * Math.PI / 30) + (second * Math.PI / (30 * 60));
        this.drawHand(ctx, minute, radius * 0.8, radius * 0.03);

        // second
        second = (second * Math.PI / 30);
        this.drawHand(ctx, second, radius * 0.9, radius * 0.02);
    }

    drawHand(ctx, pos, length, width) {
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.moveTo(0, 0);
        ctx.rotate(pos);
        ctx.lineTo(0, -length);
        ctx.strokeStyle = 'white';
        ctx.stroke();
        ctx.rotate(-pos);
    }

    render() {
        const size = '300';

        return <canvas ref = {'canvas'} id={'canvas'} width={size} height={size} className={styles.normal}></canvas>;
    }
}
