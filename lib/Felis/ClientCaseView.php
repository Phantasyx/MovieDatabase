<?php
/**
 * Created by PhpStorm.
 * User: X
 * Date: 4/3/2017
 * Time: 1:20 AM
 */

namespace Felis;


class ClientCaseView extends View
{

    public function __construct(Site $site, array $get, array $session) {
        parent::__construct($site, $get, $session);
        $this->setTitle("Felis Investigations Cases");
        $this->addLink("staff.php","Staff");
        $this->addLink("cases.php", "Cases");
        $this->addLink("", "Log out");
        $this->site = $site;
        $this->get = $get;
    }

    public function present() {

        $cases = new Cases($this->site);
        $case = $cases->get($this->get['id']);
        $hidden = '<input type="hidden" name="id" value="' . $case->getId() . '">';
        $clientName = "";
        $number = "";
        $summary = "";
        $agent = "";
        $status = "";
        if ($case) {
            $clientName = $case->getClientName();
            $number = $case->getNumber();
            $summary = $case->getSummary();
            $agent = $case->getAgent();
            $status = $case->getStatus();
        }
        $html = <<<HTML
        
<form method="post" action="post/clientcase.php">
	<fieldset>
	    $hidden
		<legend>Case</legend>
		<p>Client: $clientName</p>
		<p>
			<label for="number">Case Number: </label>
			<input type="text" id="number" name="number" placeholder="Case Number"
				   value="$number">
		</p>
		<p>
			<label for="summary">Summary</label><br>
			<input type="text" id="summary" name="summary" placeholder="Summary"
				   value="$summary">
		</p>
		<p>
			<label for="agent">Agent in Charge: </label>
			<select id="agent" name="agent">
HTML;
        $users = new Users($this->site);
        $staff = $users->getStaff();
        foreach($staff as $staffMember) {
            $id = $staffMember['id'];
            $name = $staffMember['name'];
            if ( $name == $agent ) {
                $html .= '<option selected value = "' .$id  .'" name="agentId">' . $agent. '</option>';
            } else {
                $html .= '<option value = "' .$id  .'" name="agentId">' . $agent. '</option>';
            }
        }
        $html .= <<<HTML
			</select>
		</p>
		<p>
			<label for="status">Status: </label>
			<select id="status" name="status">
HTML;
        if ($status == 'O' ) {
            $html .= '<option selected name="status">Open</option><option name="status">Closed</option>';
        }
        else {
            $html .= '<option name="status">Open</option><option selected name="status">Closed</option>';
        }
        $html .= <<<HTML
			</select>
		</p>
		<p>
			<input type="submit" value="Update" name="update">
		</p>
		<div class="notes">
		<h2>Notes</h2>
		<div class="timelist">
			<div class="report">
				<div class="info">
					<p class="time">2/10/2016 11:35am</p>
					<p class="agent">Martin, Harvey</p>
				</div>
				<p>Initial meeting with client. He's very concerned
					Felix will just not shut up at night. It's not like him to caterwaul so much, so there
					must be something going on in the neighborhood.</p>
			</div>
			<div class="report">
				<div class="info">
					<p class="time">2/14/2016 2:15pm</p>
					<p class="agent">Martin, Harvey</p>
				</div>
				<p>Met with the client to discuss the case.</p>
			</div>
		</div>
		<p>
			<label for="note">Notes</label><br>
			<textarea id="note" name="note" placeholder="Note"></textarea>
		</p>
		<p>
			<input type="submit" value="Add Note">
		</p>
		</div>
		<div class="reports">
			<h2>Reports</h2>
			<div class="timelist">
				<div class="report">
					<div class="info">
						<p class="time"><a href="report.php">2/12/2016 1:35am</a></p>
						<p class="agent">Martin, Harvey</p>
					</div>
					<p>Surveillance of neighborhood for three hours. Nothing untoward spotted.</p>
				</div>
			</div>
			<div class="timelist">
				<div class="report">
					<div class="info">
						<p class="time"><a href="report.php">2/13/2016 2:15am</a></p>
						<p class="agent">Martin, Harvey</p>
					</div>
					<p>Surveillance of neighborhood for two hours. Spotted a very attractive
						Siamese cat wandering though. Caterwauling commenced.</p>
				</div>
			</div>
			<p>
				<input type="submit" value="Add Report">
			</p>
		</div>
	</fieldset>
</form>
HTML;
        return $html;
    }
    private $site;
    private $get;
}