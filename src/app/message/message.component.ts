import { ChangeDetectionStrategy, Component, inject, Input, Output } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Message } from '../services/data.service';
import { EventEmitter } from '@angular/core';


@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageComponent {
  private platform = inject(Platform);
  @Input() message?: Message;
  @Output() toggle = new EventEmitter<Message>();
  @Output() delete = new EventEmitter<Message>();

  isIos() {
    return this.platform.is('ios')
  }
}
