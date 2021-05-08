import { Component, OnInit } from '@angular/core';

import { MigrationRunnerService } from '../db/migration-runner.service';

@Component({
  selector: 'app-debug',
  templateUrl: './debug.page.html',
  styleUrls: ['./debug.page.scss'],
})
export class DebugPage implements OnInit {

  constructor(private migrationRunnerService: MigrationRunnerService) { }

  ngOnInit() {
  }

  reverseMigrations = () => {
    this.migrationRunnerService.reverseMigrations();
  }
}
